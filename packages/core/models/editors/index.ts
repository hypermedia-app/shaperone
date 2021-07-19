import { createModel } from '@captaincodeman/rdx'
import type { NamedNode, Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import type * as Rdfs from '@rdfine/rdfs'
import type { AnyPointer } from 'clownface'
import clownface, { GraphPointer } from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import type { Store } from '../../state'
import { addMatchers } from './reducers/addMatchers'
import { addMetadata } from './reducers/addMetadata'
import { decorate } from './reducers/decorate'
import { matchSingleEditors, matchMultiEditors } from './lib/match'
import { loadDash } from './effects'

interface EditorBase {
  term: NamedNode
  meta?: Partial<Rdfs.Resource>
}

export interface MultiEditor extends EditorBase {
  match: (shape: PropertyShape) => number | null
}

export interface SingleEditor<T extends Term = Term> extends EditorBase {
  match: (shape: PropertyShape, value: GraphPointer<T>) => number | null
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
    metadata: clownface({ dataset: dataset() }),
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
