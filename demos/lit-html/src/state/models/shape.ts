import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import { sh, schema, xsd, rdfs, dash, foaf, vcard, rdf } from '@tpluscode/rdf-ns-builders'
import { turtle } from '@tpluscode/rdf-string'
import { Quad } from 'rdf-js'
import * as formats from '@rdf-esm/formats-common'
import rdfFetch from '@rdfjs/fetch-lite'
import clownface, { AnyPointer, GraphPointer } from 'clownface'
import type { Store } from '../store'

const triples = turtle`@prefix ex: <http://example.com/> .
@prefix lexvo: <http://lexvo.org/id/iso639-1/> .

ex:PersonShape
  a ${sh.Shape} ;
  ${sh.targetClass} ${schema.Person} ;
  ${rdfs.label} "Person" ;
  ${sh.property} ex:NameProperty ,
                 ex:KnowsProperty ,
                 ex:AgeProperty ,
                 ex:GenderProperty ,
                 ex:SpokenLanguagesProperty  ,
                 ex:DateOfBirthProperty ,
                 ex:HomePageProperty ;
.

ex:SimplifiedPersonShape
  a ${sh.Shape} ;
  ${sh.targetNode} ex:Jane_Doe ;
  ${rdfs.label} "Person (name-only)" ;
  ${sh.property} ex:NameProperty ;
.

ex:NameProperty
  ${sh.path} ${schema.name} ;
  ${sh.name} "Name" ;
  ${sh.datatype} ${xsd.string} ;
  ${dash.singleLine} true ;
  ${sh.maxCount} 1 ;
  ${sh.minCount} 1 ;
  ${sh.order} 1 ;
.

ex:KnowsProperty
  ${sh.path} ${schema.knows} ;
  ${sh.class} ${schema.Person} ;
  ${sh.group} ex:FriendGroup ;
.

ex:AgeProperty
  ${sh.path} ${schema.age} ;
  ${sh.name} "Age" ;
  ${sh.datatype} ${xsd.integer} ;
  ${sh.maxCount} 1 ;
  ${sh.defaultValue} 21 ;
  ${sh.order} 2 ;
.

ex:GenderProperty
  ${sh.path} ${foaf.gender} ;
  ${sh.name} "Gender" ;
  ${sh.in} (
    "Male" "Female" "Other" "Prefer not to tell"
  ) ;
  ${sh.maxCount} 1 ;
  ${sh.order} 3 ;
.

ex:DateOfBirthProperty
  ${sh.path} ${schema.birthDate} ;
  ${sh.name} "Date of birth" ;
  ${sh.maxCount} 1 ;
  ${sh.order} 4 ;
  ${sh.datatype} ${xsd.date} ;
.

ex:SpokenLanguagesProperty
  ${sh.path} ${vcard.language} ;
  ${sh.name} "Spoken languages" ;
  ${sh.nodeKind} ${sh.IRI} ;
  ${sh.in} (
    lexvo:en lexvo:de lexvo:fr lexvo:pl lexvo:es
  ) ;
  ${sh.order} 5 ;
.

ex:HomePageProperty
  ${sh.path} ${foaf.homepage} ;
  ${sh.name} "Homepage URL" ;
  ${sh.nodeKind} ${sh.IRI} ;
  ${sh.order} 6 ;
.

ex:FriendGroup
  a ${sh.PropertyGroup} ;
  ${rdfs.label} "Acquaintances"
.

lexvo:en ${rdfs.label} "English" .
lexvo:de ${rdfs.label} "German" .
lexvo:fr ${rdfs.label} "French" .
lexvo:pl ${rdfs.label} "Polish" .
lexvo:es ${rdfs.label} "Spanish" .`

export interface State {
  serialized: string
  format: string
  pointer?: AnyPointer
  shapes: GraphPointer[]
  quads: Quad[]
  error?: Error
  options: {
    clearResource: boolean
    loadedShapeUri?: string
    authHeader?: string
  }
}

export const shape = createModel({
  state: <State>{
    serialized: triples.toString(),
    format: 'text/turtle',
    shapes: [],
    quads: [],
    options: {
      clearResource: false,
    },
  },
  reducers: {
    error(state, error: Error | undefined) {
      return { ...state, error }
    },
    setShapesGraph(state, quads: Quad[]) {
      let pointer = clownface({ dataset: $rdf.dataset(quads) })
      const shapes = pointer.has(rdf.type, [sh.Shape, sh.NodeShape])
      if (state.pointer?.term) {
        const previousPointer = pointer.node(state.pointer.term)
        if (previousPointer.has(rdf.type, [sh.Shape, sh.NodeShape]).terms.length) {
          pointer = previousPointer
        }
      }

      return {
        ...state,
        pointer,
        shapes: shapes.toArray(),
        quads,
      }
    },
    selectRootShape(state, pointer: GraphPointer | undefined) {
      if (!pointer) {
        return {
          ...state,
          pointer: state.pointer?.any(),
        }
      }

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
      }
    },
    setOptions(state, options: State['options']) {
      return {
        ...state,
        options,
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      async loadShape({ shape, authHeader, clearResource }: { shape: string; authHeader: string; clearResource: boolean }) {
        const shapes = await rdfFetch(shape, {
          formats: formats as any,
          factory: $rdf,
          headers: {
            authorization: `Bearer ${authHeader}`,
          },
        })

        if (shapes.ok) {
          const dataset = await shapes.dataset()
          dispatch.shape.setShapesGraph([...dataset])
          if (clearResource) {
            dispatch.resource.replaceGraph({
              dataset: [],
            })
          }
          dispatch.shape.setOptions({
            clearResource,
            loadedShapeUri: shape,
            authHeader,
          })
        } else {
          alert(`Failed to load shapes: ${shapes.status}`)
        }
      },
      async generateInstances() {
        const state = store.getState()
        if (state.shape.pointer) {
          const { nanoid } = await import('nanoid')

          const dataset = $rdf.dataset([...state.shape.pointer.dataset])
          const graph = clownface({ dataset })
          graph
            .has(sh.class)
            .out(sh.class)
            .forEach((clas) => {
              const lastSeparator = Math.max(clas.value.lastIndexOf('#'), clas.value.lastIndexOf('/'))
              const clasName = clas.value.substr(lastSeparator + 1)
              const instanceId = nanoid(5)
              graph.namedNode(`${document.location.origin}/${clasName}/${instanceId}`)
                .addOut(rdf.type, clas)
                .addOut(rdfs.label, `${clasName} ${instanceId}`)
            })
          dispatch.shape.setShapesGraph([...dataset])
        }
      },
    }
  },
})
