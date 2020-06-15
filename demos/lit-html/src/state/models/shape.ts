import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { SingleContextClownface } from 'clownface'
import { rdf, sh, schema, xsd, rdfs } from '@tpluscode/rdf-ns-builders'
import { Store } from '../store'
import { turtle } from '@tpluscode/rdf-string'

const triples = turtle`@prefix ex: <http://example.com/> .

ex:PersonShape
  a ${sh.Shape} ;
  ${sh.targetClass} ${schema.Person} ;
  ${rdfs.label} "Person" ;
  ${sh.property} [
    ${sh.path} ${schema.name} ;
    ${sh.name} "Name" ;
    ${sh.datatype} ${xsd.string} ;
    ${sh.maxCount} 1 ;
    ${sh.minCount} 1 ;
    ${sh.order} 1
  ] ;
  ${sh.property} [
    ${sh.path} ${schema.knows} ;
    ${sh.class} ${schema.Person} ;
    ${sh.group} ex:FriendGroup
  ] ;
  ${sh.property} [
    ${sh.path} ${schema.age} ;
    ${sh.name} "Age" ;
    ${sh.datatype} ${xsd.integer} ;
    ${sh.order} 2
  ]
.

ex:FriendGroup
  a ${sh.PropertyGroup} ;
  ${rdfs.label} "Acquaintances"
.`

export interface State {
  triples: string
  pointer?: SingleContextClownface
}

export const shape = createModel({
  state: <State>{
    triples: triples.toString(),
  },
  reducers: {
    setShape(state, pointer) {
      return {
        ...state,
        pointer,
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()

    return {
      async parse(triples?: string) {
        const stream = parsers.import('text/turtle', toStream(triples || store.getState().shape.triples))
        if (!stream) {
          throw new Error('Failed to parse shape')
        }

        const dataset = await $rdf.dataset().import(stream)
        const foundShapes = cf({ dataset }).has(rdf.type, [sh.NodeShape, sh.Shape])
        if (foundShapes.terms.length === 0) {
          throw new Error('Did not find any shape')
        }

        dispatch.shape.setShape(foundShapes.toArray()[0])
      },
    }
  },
})
