import { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { config } from './state/config'
import type { SingleContextClownface } from 'clownface'
import { EditorMatch } from './lib/editorMatcher'
import { NamedNode } from 'rdf-js'
import { PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { FocusNode } from './index'
import { EditorMap } from './EditorMap'

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

export interface PropertyObjectState {
  object: SingleContextClownface
  editors: EditorMatch[]
  selectedEditor: NamedNode | undefined
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  compoundEditors: EditorMatch[]
  objects: PropertyObjectState[]
  maxReached: boolean
}
export interface PropertyGroupState {
  group: PropertyGroup | undefined
  order: number
  selected: boolean
}

export interface FocusNodeState {
  focusNode: FocusNode
  shape?: Shape
  properties: PropertyState[]
  groups: PropertyGroupState[]
}

export interface FormState {
  rootShape?: Shape
  editorMap: EditorMap
  compoundEditorMap: EditorMap
  editors: Record<string, { loaded: boolean }>
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
}
