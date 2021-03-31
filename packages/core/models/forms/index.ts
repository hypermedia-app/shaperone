import { createModel } from '@captaincodeman/rdx'
import { NamedNode } from 'rdf-js'
import type { NodeShape, PropertyGroup, PropertyShape, ValidationResult } from '@rdfine/shacl'
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
import * as validation from './reducers/validation'
import { FocusNode } from '../../index'
import type { MultiEditor, SingleEditorMatch } from '../editors'
import { createFocusNodeState } from './reducers/replaceFocusNodes'
import editorsEffects from './effects/editors'
import shapesEffects from './effects/shapes'
import resourcesEffects from './effects/resources'
import componentsEffects from './effects/components'
import type { Store } from '../../state'
import type { ComponentInstance } from '../components'

export interface ValidationResultState {
  result: ValidationResult
  matchedTo: 'focusNode' | 'property' | 'object' | null
}

interface ValidationState {
  validationResults: ValidationResultState[]
  hasErrors: boolean
}

export interface PropertyObjectState<TState extends ComponentInstance = ComponentInstance> extends ValidationState {
  key: string
  object?: GraphPointer
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  editorSwitchDisabled?: boolean
  componentState: TState
}

export interface ShouldEnableEditorChoice {
  (params?: { object?: GraphPointer }): boolean
}

export interface PropertyState extends ValidationState {
  shape: PropertyShape
  name: string
  editors: MultiEditor[]
  selectedEditor: NamedNode | undefined
  componentState: Record<string, any>
  objects: PropertyObjectState[]
  canAdd: boolean
  canRemove: boolean
  datatype?: NamedNode
  hidden: boolean
}
export interface PropertyGroupState {
  group: PropertyGroup | undefined
  order: number
  selected: boolean
}

export interface FocusNodeState extends ValidationState {
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

export interface FormState extends FormSettings, ValidationState {
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
  ...validation,
}

export const forms = createModel({
  state: <State> new Map(),
  reducers,
  effects(store: Store) {
    return {
      ...editorsEffects(store),
      ...shapesEffects(store),
      ...resourcesEffects(store),
      ...componentsEffects(store),
      ...effects(store),
    }
  },
})
