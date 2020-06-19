import { createModel } from '@captaincodeman/rdx'
import * as reducers from './reducers'
import { PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { SingleContextClownface } from 'clownface'
import { NamedNode } from 'rdf-js'
import { FocusNode } from '../../index'
import type { EditorMatcher } from '../../editors/index'

export interface PropertyObjectState {
  object: SingleContextClownface
  editors: EditorMatcher[]
  selectedEditor: NamedNode | undefined
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  compoundEditors: EditorMatcher[]
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
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
}

export const form = createModel({
  state: <FormState>{
    focusNodes: {},
    focusStack: [],
  },
  reducers,
})
