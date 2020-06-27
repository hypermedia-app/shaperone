import { createModel } from '@captaincodeman/rdx'
import { SingleContextClownface } from 'clownface'
import { DatasetCore, NamedNode } from 'rdf-js'
import { NodeShape, PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { effects } from './effects'
import { addObject } from './reducers/addObject'
import { popFocusNode } from './reducers/popFocusNode'
import { pushFocusNode } from './reducers/pushFocusNode'
import { removeObject } from './reducers/removeObject'
import { selectEditor } from './reducers/selectEditor'
import { selectGroup } from './reducers/selectGroup'
import { selectShape } from './reducers/selectShape'
import { truncateFocusNodes } from './reducers/truncateFocusNodes'
import { updateObject } from './reducers/updateObject'
import * as connection from './reducers/connection'
import * as datasets from './reducers/datasets'
import * as editors from './reducers/editors'
import { FocusNode } from '../../index'
import { CompoundEditor, ValueEditor } from '../editors/index'

export interface PropertyObjectState {
  object: SingleContextClownface
  editors: ValueEditor[]
  selectedEditor: NamedNode | undefined
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  compoundEditors: CompoundEditor[]
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
  shapes: NodeShape[]
  properties: PropertyState[]
  groups: PropertyGroupState[]
}

export interface FormState {
  resourceGraph?: DatasetCore
  shapesGraph?: DatasetCore
  shapes: Shape[]
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
}

export type State = {
  valueEditors: ValueEditor[]
  instances: Map<unknown, FormState>
}

const reducers = {
  addObject,
  popFocusNode,
  pushFocusNode,
  removeObject,
  selectEditor,
  selectGroup,
  selectShape,
  truncateFocusNodes,
  updateObject,
  ...connection,
  ...datasets,
  ...editors,
}

export const forms = createModel<State, typeof reducers, ReturnType<typeof effects>>({
  state: {
    valueEditors: [],
    instances: new Map(),
  },
  reducers,
  effects,
})
