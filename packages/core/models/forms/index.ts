import { createModel } from '@captaincodeman/rdx'
import { NamedNode, Term } from 'rdf-js'
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
import * as editors from './reducers/editors'
import * as multiEditors from './reducers/multiEditors'
import { FocusNode } from '../../index'
import type { MultiEditor, SingleEditorMatch } from '../editors/index'
import { replaceFocusNodes } from './reducers/replaceFocusNodes'
import { setObjectValue } from './reducers/setObjectValue'
import { updatePropertyObjects } from './reducers/updatePropertyObjects'

export interface PropertyObjectState {
  key: string
  object: Term
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  editorSwitchDisabled?: boolean
}

export interface ShouldEnableEditorChoice {
  ({ object }: { object: Term }): boolean
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
  shapes: NodeShape[]
  properties: PropertyState[]
  groups: PropertyGroupState[]
  label: string
}
export interface FormState {
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export type State = {
  instances: Map<symbol, FormState>
}

const reducers = {
  addObject,
  replaceFocusNodes,
  popFocusNode,
  pushFocusNode,
  removeObject,
  selectEditor,
  selectGroup,
  selectShape,
  truncateFocusNodes,
  ...objects,
  ...connection,
  ...editors,
  ...multiEditors,
  setObjectValue,
  updatePropertyObjects,
}

export const forms = createModel<State, typeof reducers, ReturnType<typeof effects>>({
  state: {
    instances: new Map(),
  },
  reducers,
  effects,
})
