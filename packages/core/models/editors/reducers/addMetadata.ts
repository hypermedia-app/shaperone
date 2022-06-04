import { DatasetCore, Quad } from 'rdf-js'
import * as RDF from '@rdf-esm/dataset'
import cf, { AnyPointer } from 'clownface'
import type { Editor, EditorsState } from '../index'

type AllEditors = EditorsState['allEditors']
type MultiEditors = EditorsState['multiEditors']
type SingleEditors = EditorsState['singleEditors']

function updateMeta<T>(metadata: AnyPointer) {
  return (previousValue: T, [key, editor]: [string, Editor | undefined]): T => {
    if (!editor) {
      return previousValue
    }

    return {
      ...previousValue,
      [key]: {
        ...editor,
        meta: metadata.node(editor.term),
      },
    }
  }
}

export function addMetadata(state: EditorsState, moreMeta: DatasetCore | Iterable<Quad>): EditorsState {
  let dataset = state.metadata?.dataset
  if (state.metadata?.dataset) {
    [...moreMeta].forEach(({ subject, predicate, object }) => state.metadata.dataset.add(RDF.quad(subject, predicate, object)))
  } else if ('add' in moreMeta) {
    dataset = moreMeta
  } else {
    dataset = RDF.dataset([...moreMeta])
  }

  const metadata = cf({ dataset })
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
