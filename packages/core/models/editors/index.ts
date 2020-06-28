import { createModel } from '@captaincodeman/rdx'
import type { DatasetCore, NamedNode } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import { vocabularies } from '@zazuko/rdf-vocabularies'
import cf, { Clownface, SingleContextClownface } from 'clownface'
import type { Dispatch, Store } from '../../state'
import addMatchers from './reducers/addMatchers'

export type Editor<T extends EditorMatcher = SingleEditor | MultiEditor> = T & {
  label: string
}

// todo: re-export from main module
export interface EditorMatcher {
  term: NamedNode
}

export interface MultiEditor extends EditorMatcher {
  match: (shape: PropertyShape) => number | null
}

export interface SingleEditor extends EditorMatcher {
  match: (shape: PropertyShape, value: SingleContextClownface) => number | null
}

type EditorMap<T> = Record<string, T>

export interface EditorsState {
  metadata: Clownface
  allEditors: EditorMap<Editor<EditorMatcher>>
  singleEditors: EditorMap<Editor<SingleEditor>>
  multiEditors: EditorMap<Editor<MultiEditor>>
}

export const editors = createModel(({
  state: <EditorsState>{
    multiEditors: {},
    singleEditors: {},
    allEditors: {},
  },
  reducers: {
    addMetadata(state, dataset: DatasetCore) {
      let metadata: DatasetCore = state.metadata?.dataset
      if (metadata) {
        [...dataset].forEach(quad => metadata.add(quad))
      } else {
        metadata = dataset
      }

      return {
        ...state,
        metadata: cf({ dataset: metadata }),
      }
    },
    addMatchers,
  },
  effects(store: Store) {
    const dispatch: Dispatch = store.dispatch()

    return {
      async loadDash() {
        const { dash } = await vocabularies({ only: ['dash'] })
        const DashEditors = await import('../../DashEditors')

        dispatch.editors.addMetadata(dash)
        dispatch.editors.addMatchers(DashEditors)
      },
    }
  },
}))
