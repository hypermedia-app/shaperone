import { createModel } from '@captaincodeman/rdx'
import { NamedNode } from 'rdf-js'
import type { NodeShape, PropertyGroup, PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import effects from './effects'
import { addFormField } from './reducers/addFormField'
import { popFocusNode } from './reducers/popFocusNode'
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
import { createFocusNodeState } from './reducers/replaceFocusNodes'
import editorsEffects from './effects/editors'
import shapesEffects from './effects/shapes'
import resourcesEffects from './effects/resources'
import type { Store } from '../../state'

export interface PropertyObjectState<ComponentState extends Record<string, any> = Record<string, any>> {
  key: string
  object?: GraphPointer
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  editorSwitchDisabled?: boolean
  componentState: ComponentState
}

export interface ShouldEnableEditorChoice {
  (params?: { object?: GraphPointer }): boolean
}

export interface PropertyState {
  shape: PropertyShape
  name: string
  editors: MultiEditor[]
  selectedEditor: NamedNode | undefined
  componentState: Record<string, any>
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
  shape?: NodeShape
  shapes: NodeShape[]
  properties: PropertyState[]
  groups: PropertyGroupState[]
}

export interface FormSettings {
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  languages: string[]
  labelProperties: NamedNode[]
}

export interface FormState extends FormSettings {
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
}

export type State = Map<symbol, FormState>

const reducers = {
  addFormField,
  popFocusNode,
  removeObject,
  selectEditor,
  selectGroup,
  selectShape,
  truncateFocusNodes,
  ...objects,
  ...connection,
  ...editors,
  ...multiEditors,
  createFocusNodeState,
}

export const forms = createModel({
  state: <State> new Map(),
  reducers,
  effects(store: Store) {
    return {
      ...editorsEffects(store),
      ...shapesEffects(store),
      ...resourcesEffects(store),
      ...effects(store),
    }
  },
})
