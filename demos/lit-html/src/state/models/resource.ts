import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { SingleContextClownface } from 'clownface'
import { Store } from '../store'
import { DatasetCore } from 'rdf-js'
import { turtle } from '@tpluscode/rdf-string'

const triples = `@prefix schema: <http://schema.org/> .
@prefix ex: <http://example.com/> .

ex:John_Doe a schema:Person ;
  schema:name "John Doe" ;
  schema:knows ex:Jane_Doe .

ex:Jane_Doe
  schema:name "Janet" .
`

export interface State {
  pointer?: SingleContextClownface
  triples: string
}

export const resource = createModel({
  state: <State>{
    triples,
  },
  reducers: {
    updatePointer(state, { pointer }: { pointer: SingleContextClownface }) {
      return {
        ...state,
        pointer,
      }
    },
    serialize(state, dataset: DatasetCore) {
      return {
        ...state,
        triples: turtle`${dataset}`.toString(),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()
    return {
      async parse(resourceTriples?: string) {
        const stream = parsers.import('text/turtle', toStream(resourceTriples || store.getState().resource.triples))
        if (!stream) {
          throw new Error('Failed to parse resource')
        }

        const dataset = await $rdf.dataset().import(stream)

        dispatch.resource.updatePointer({
          pointer: cf({ dataset, term: $rdf.namedNode('http://example.com/John_Doe') }),
        })
      },
    }
  },
})
