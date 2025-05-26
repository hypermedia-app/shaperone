import type { DatasetCore, Quad } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import type { Editor, EditorsState } from '../index.js'
import type { ShaperoneEnvironment } from '../../../env.js'
import env from '../../../env.js'

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

export function addMetadata(state: EditorsState, factory: (env: ShaperoneEnvironment) => AnyPointer | DatasetCore | Iterable<Quad>): EditorsState {
  const moreMeta = getQuads(factory(env()))

  let dataset = state.metadata?.dataset
  if (state.metadata?.dataset) {
    [...moreMeta].forEach(({ subject, predicate, object }) => state.metadata.dataset.add(env().quad(subject, predicate, object)))
  } else {
    dataset = env().dataset([...moreMeta])
  }

  const metadata = env().clownface({ dataset })
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

function getQuads(data: AnyPointer | DatasetCore | Iterable<Quad>): Iterable<Quad> {
  if ('dataset' in data) {
    return data.dataset
  }

  if ('size' in data) {
    return data
  }

  return data
}
