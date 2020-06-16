import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { SingleContextClownface } from 'clownface'
import { rdf, sh, schema, xsd, rdfs } from '@tpluscode/rdf-ns-builders'
import { Store } from '../store'
import { turtle } from '@tpluscode/rdf-string'
import { Menu, updateMenu } from '../../menu'
import { DatasetCore } from 'rdf-js'
import { serialize } from '../../serializer'

const context = [
  'https://raw.githubusercontent.com/w3c/shacl/master/shacl-jsonld-context/shacl.context.ld.json',
  {
    schema: schema().value,
    ex: 'http://example.com/',
  },
]

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
  serialized: string
  format: string
  pointer?: SingleContextClownface
  menu: Menu
}

export const shape = createModel({
  state: <State>{
    serialized: triples.toString(),
    format: 'text/turtle',
    menu: {
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
      }, {
        type: 'format',
        text: 'text/turtle',
        checked: true,
      }],
    },
  },
  reducers: {
    setShape(state, pointer) {
      return {
        ...state,
        pointer,
      }
    },
    serialized(state, serialized: string): State {
      return {
        ...state,
        serialized,
      }
    },
    format(state, format: string) {
      return {
        ...state,
        format,
        menu: updateMenu(state.menu, 'format', format),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()

    return {
      async parse() {
        const { shape } = store.getState()

        const stream = parsers.import(shape.format, toStream(shape.serialized), {
          context,
        })
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

      async serialize(dataset: DatasetCore) {
        const { shape } = store.getState()

        dispatch.shape.serialized(await serialize(dataset, shape.format, {
          context: {
            '@context': context,
            '@type': 'Shape',
            '@embed': '@always',
          },
          compact: true,
          frame: true,
          skipContext: true,
        }))
      },

      async changeFormat(format: Menu) {
        const { shape } = store.getState()

        dispatch.shape.format(format.text)

        if (shape.pointer) {
          dispatch.shape.serialize(shape.pointer.dataset)
        }
      },
    }
  },
})
