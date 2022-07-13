import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import cf, { AnyPointer, GraphPointer } from 'clownface'
import { rdf, foaf } from '@tpluscode/rdf-ns-builders'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { DatasetCore, Quad } from 'rdf-js'

export interface State {
  serialized?: string
  graph?: AnyPointer
  pointer?: GraphPointer
  quads: Quad[]
  format: string
  prefixes: string[]
  resourcesToSelect: string[]
  selectedResource: string | undefined
  error?: Error
}

const graph = cf({ dataset: $rdf.dataset() })
const pointer = graph
  .namedNode('http://example.com/John_Doe')
  .addOut(rdf.type, schema.Person)
  .addOut(schema.name, 'John Doe')
  .addOut(foaf.gender, 'Malee')
  .addOut(schema.age, 17)
  .addOut(schema.knows, $rdf.namedNode('http://example.com/Jane_Doe'), (jane) => {
    jane.addOut(schema.name, 'Janet')
      .addOut(rdf.type, schema.Person)
  })

const defaultPrefixes = ['schema', 'foaf', 'vcard']

export const resource = createModel({
  state: <State>{
    graph,
    pointer,
    quads: [...graph.dataset],
    format: 'application/ld+json',
    prefixes: defaultPrefixes,
    resourcesToSelect: [],
    selectedResource: pointer.value,
  },
  reducers: {
    error(state, error: Error | undefined) {
      return { ...state, error }
    },
    setResourceQuads(state, dataset: DatasetCore) {
      return {
        ...state,
        quads: [...dataset],
      }
    },
    replaceGraph(state, { dataset, updatePointer = true, resetPointer = false }: { dataset: Quad[] | DatasetCore; updatePointer?: boolean; resetPointer?: boolean }) {
      const graph = Array.isArray(dataset) ? cf({ dataset: $rdf.dataset(dataset) }) : cf({ dataset })
      let { pointer } = state

      if (updatePointer) {
        if (state.selectedResource && !resetPointer) {
          pointer = graph.namedNode(state.selectedResource)
        } else {
          pointer = graph.namedNode('')
        }
      }

      return {
        ...state,
        graph,
        pointer,
        quads: [...graph.dataset],
      }
    },
    setSerialized(state, serialized: string) {
      return {
        ...state,
        serialized,
      }
    },
    selectResource(state, { id }: { id: string }) {
      return {
        ...state,
        selectedResource: id,
        pointer: state.graph?.in().toArray().find(term => term.value === id),
      }
    },
    setPrefixes(state, prefixes: string[]) {
      return {
        ...state,
        prefixes,
      }
    },
    context(state, context: Record<string, any>) {
      return {
        ...state,
        context,
      }
    },
    format(state, format: string) {
      return {
        ...state,
        format,
      }
    },
  },
})
