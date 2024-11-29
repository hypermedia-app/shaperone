import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from '@rdfjs/types'
import type { PropertyShape } from '@rdfine/shacl'
import type { AnyPointer, GraphPointer } from 'clownface'
import type { Store } from '../../state/index.js'
import { addMatchers } from './reducers/addMatchers.js'
import { addMetadata } from './reducers/addMetadata.js'
import { decorate } from './reducers/decorate.js'
import { matchSingleEditors, matchMultiEditors } from './lib/match.js'
import { loadDash } from './effects/index.js'
import type { ShaperoneEnvironment } from '../../env.js'

interface EditorBase {
  term: NamedNode
  meta?: GraphPointer
}

export interface MultiEditor extends EditorBase {
  match: (shape: PropertyShape) => number | null
}

export interface SingleEditor<T extends Term = Term> extends EditorBase {
  match: (shape: PropertyShape, value: GraphPointer<T>, env: ShaperoneEnvironment) => number | null
}

export interface MatcherDecorator<T extends Term = Term> extends EditorBase {
  decorate<TEditor extends SingleEditor<T> | MultiEditor>(matcher: TEditor): TEditor['match']
}

export type Editor = SingleEditor | MultiEditor

export interface SingleEditorMatch extends Omit<SingleEditor, 'match'> {
  score: number | null
}

export interface MultiEditorMatch extends Omit<MultiEditor, 'match'> {
  score: number | null
}

type EditorMap<T> = Record<string, T | undefined>

export interface EditorsState {
  metadata: AnyPointer
  allEditors: EditorMap<Editor>
  singleEditors: EditorMap<SingleEditor>
  multiEditors: EditorMap<MultiEditor>
  matchSingleEditors: typeof matchSingleEditors
  matchMultiEditors: typeof matchMultiEditors
  decorators: EditorMap<MatcherDecorator[]>
}

export const editors = createModel(({
  state: <EditorsState>{
    multiEditors: {},
    singleEditors: {},
    allEditors: {},
    decorators: {},
    matchSingleEditors,
    matchMultiEditors,
  },
  reducers: {
    addMetadata,
    addMatchers,
    decorate,
  },
  effects(store: Store) {
    return {
      loadDash: loadDash(store),
    }
  },
}))
