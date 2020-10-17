import { createModel } from '@captaincodeman/rdx'
import { AnyPointer, GraphPointer } from 'clownface'
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
import * as objects from './reducers/updateObject'
import * as connection from './reducers/connection'
import * as datasets from './reducers/datasets'
import * as editors from './reducers/editors'
import * as multiEditors from './reducers/multiEditors'
import { FocusNode } from '../../index'
import type { MultiEditor, SingleEditor, SingleEditorMatch } from '../editors/index'

export interface PropertyObjectState {
  object: GraphPointer
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  editorSwitchDisabled?: boolean
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  editors: MultiEditor[]
  selectedEditor: NamedNode | undefined
  objects: PropertyObjectState[]
  canAdd: boolean
  canRemove: boolean
  datatype?: NamedNode
}
export interface PropertyGroupState {
  group: PropertyGroup | undefined
  order: number
  selected: boolean
}

export interface FocusNodeState {
  focusNode: FocusNode
  shape?: Shape
  matchingShapes: NodeShape[]
  shapes: NodeShape[]
  properties: PropertyState[]
  groups: PropertyGroupState[]
  label: string
}

export interface FormState {
  resourceGraph?: DatasetCore
  shapesGraph?: AnyPointer
  shapes: Shape[]
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
}

export type State = {
  singleEditors: SingleEditor[]
  multiEditors: MultiEditor[]
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
  ...objects,
  ...connection,
  ...datasets,
  ...editors,
  ...multiEditors,
}

export const forms = createModel<State, typeof reducers, ReturnType<typeof effects>>({
  state: {
    singleEditors: [],
    multiEditors: [],
    instances: new Map(),
  },
  reducers,
  effects,
})
