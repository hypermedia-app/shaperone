import { StoreDispatch } from '@captaincodeman/rdx'
import { config } from './state/config'
import type { SingleContextClownface } from 'clownface'
import { EditorMatch, EditorMatcher } from './lib/editorMatcher'
import { NamedNode } from 'rdf-js'
import { PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { FocusNode } from './index'

export type Dispatch = StoreDispatch<typeof config>

export interface PropertyObjectState {
  object: SingleContextClownface
  editors: EditorMatch[]
  selectedEditor: NamedNode
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  compoundEditors: EditorMatch[]
  objects: PropertyObjectState[]
  maxReached: boolean
}

export interface FocusNodeState {
  focusNode: FocusNode
  shape: Shape
  properties: PropertyState[]
  groups: PropertyGroup[]
}

export interface FormState {
  matchers: EditorMatcher[]
  focusNodes: Record<string, FocusNodeState>
}
