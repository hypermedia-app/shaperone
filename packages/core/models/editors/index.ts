import { createModel } from '@captaincodeman/rdx'
import type { DatasetCore, NamedNode } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import { vocabularies } from '@zazuko/rdf-vocabularies'
import cf, { Clownface, SingleContextClownface } from 'clownface'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import type { Dispatch, Store } from '../../state'

export type Editor<T extends EditorMatcher = ValueEditor | CompoundEditor> = T & {
  label: string
}

// todo: re-export from main module
export interface EditorMatcher {
  term: NamedNode
}

export interface CompoundEditor extends EditorMatcher {
  match: (shape: PropertyShape) => number | null
}

export interface ValueEditor extends EditorMatcher {
  match: (shape: PropertyShape, value: SingleContextClownface) => number | null
}

type EditorMap<T> = Record<string, T>

export interface EditorsState {
  metadata: Clownface
  valueEditors: EditorMap<Editor<ValueEditor>>
  aggregateEditors: EditorMap<Editor<CompoundEditor>>
}

export const editors = createModel(({
  state: <EditorsState>{
    aggregateEditors: {},
    valueEditors: {},
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

    addMatchers(state, editors: Record<string, ValueEditor | CompoundEditor>) {
      return Object.values(editors).reduce((newState, editor) => {
        const meta = state.metadata.node(editor.term)
        const label = meta.out(rdfs.label).values[0] || editor.term.value

        if (meta.has(rdf.type, dash.CompoundEditor).terms.length) {
          return {
            ...newState,
            aggregateEditors: {
              ...newState.aggregateEditors,
              [editor.term.value]: {
                ...editor as CompoundEditor,
                label,
              },
            },
          }
        }

        return {
          ...newState,
          valueEditors: {
            ...newState.valueEditors,
            [editor.term.value]: {
              ...editor,
              label,
            },
          },
        }
      }, state)
    },
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
