import type { DatasetCore, Quad } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import type { Editor, EditorsState } from '../index.js'
import env, { ShaperoneEnvironment } from '../../../env.js'

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

export function addMetadata(state: EditorsState, factory: (env: ShaperoneEnvironment) => DatasetCore | Iterable<Quad>): EditorsState {
  const moreMeta = factory(env())

  let dataset = state.metadata?.dataset
  if (state.metadata?.dataset) {
    [...moreMeta].forEach(({ subject, predicate, object }) => state.metadata.dataset.add(env().quad(subject, predicate, object)))
  } else if ('add' in moreMeta) {
    dataset = moreMeta
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
