import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import type * as Rdfs from '@rdfine/rdfs'
import { vocabularies } from '@zazuko/rdf-vocabularies/lib/vocabularies'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import type { AnyPointer, GraphPointer } from 'clownface'
import type { Dispatch, Store } from '../../state'
import { addMatchers } from './reducers/addMatchers'
import { addMetadata } from './reducers/addMetadata'

// todo: re-export from main module
export interface EditorMatcher {
  term: NamedNode
}

export interface MultiEditor extends EditorMatcher {
  match: (shape: PropertyShape) => number | null
}

export interface SingleEditor<T extends Term = Term> extends EditorMatcher {
  match: (shape: PropertyShape, value: GraphPointer<T>) => number | null
}

export type Editor<T extends EditorMatcher = SingleEditor | MultiEditor> = T & {
  meta: Rdfs.Resource
}

export interface SingleEditorMatch extends SingleEditor {
  score: number | null
}

type EditorMap<T> = Record<string, T>

export interface EditorsState {
  metadata: AnyPointer
  allEditors: EditorMap<Editor<EditorMatcher>>
  singleEditors: EditorMap<Editor<SingleEditor>>
  multiEditors: EditorMap<Editor<MultiEditor>>
}

export const editors = createModel(({
  state: <EditorsState>{
    multiEditors: {},
    singleEditors: {},
    allEditors: {},
    metadata: cf({ dataset: $rdf.dataset() }),
  },
  reducers: {
    addMetadata,
    addMatchers,
  },
  effects(store: Store) {
    const dispatch: Dispatch = store.getDispatch()

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
