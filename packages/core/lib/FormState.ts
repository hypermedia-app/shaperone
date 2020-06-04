import type { PropertyShape, Shape, PropertyGroup } from '@rdfine/shacl'
import type {NamedNode, Term} from 'rdf-js'
import type { SingleContextClownface } from 'clownface'
import type { FocusNode } from '../index'
import { PropertyMatcher } from './propertyMatcher'

export interface EditorChoice {
  editor: NamedNode
  score: number | null
}

export interface PropertyObjectState {
  object: SingleContextClownface
  editors: EditorChoice[]
  selectedEditor: NamedNode
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  compoundEditors: EditorChoice[]
  objects: PropertyObjectState[]
  maxReached: boolean
}

export interface PropertyGroupState {
  group?: PropertyGroup
  properties: Record<string, PropertyState>
}

export interface FocusNodeState {
  focusNode: FocusNode
  shape: Shape
  groups: Record<string, PropertyGroupState>
}

export interface FormState {
  matchers: PropertyMatcher[]
  focusNodes: Record<string, FocusNodeState>
}
