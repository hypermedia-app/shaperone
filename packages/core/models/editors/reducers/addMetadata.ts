import { DatasetCore } from 'rdf-js'
import * as RDF from '@rdfjs/data-model'
import cf, { Clownface } from 'clownface'
import type { Editor, EditorMatcher, EditorsState } from '../index'
import { EditorMeta } from '../lib/EditorMeta'

type AllEditors = EditorsState['allEditors']
type MultiEditors = EditorsState['multiEditors']
type SingleEditors = EditorsState['singleEditors']

function updateMeta<T>(metadata: Clownface) {
  return (previousValue: T, [key, editor]: [string, Editor<EditorMatcher>]): T => ({
    ...previousValue,
    [key]: {
      ...editor,
      meta: new EditorMeta(metadata.node(editor.term)),
    },
  })
}

export function addMetadata(state: EditorsState, dataset: DatasetCore): EditorsState {
  const metadataDataset = state.metadata.dataset;
  [...dataset].forEach(({ subject, predicate, object }) => metadataDataset.add(RDF.quad(subject, predicate, object)))

  const metadata = cf({ dataset: metadataDataset })
  const allEditors = Object.entries(state.allEditors).reduce(updateMeta<AllEditors>(metadata), {})
  const multiEditors = Object.entries(state.multiEditors).reduce(updateMeta<MultiEditors>(metadata), {})
  const singleEditors = Object.entries(state.singleEditors).reduce(updateMeta<SingleEditors>(metadata), {})

  return {
    ...state,
    allEditors,
    multiEditors,
    singleEditors,
    metadata,
  }
}
