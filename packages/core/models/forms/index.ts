import { createModel } from '@captaincodeman/rdx'
import { NamedNode } from 'rdf-js'
import type { NodeShape, PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import type { sh } from '@tpluscode/rdf-ns-builders'
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
import * as properties from './reducers/properties'
import { FocusNode } from '../../index'
import type { MultiEditor, SingleEditorMatch } from '../editors'
import { createFocusNodeState } from './reducers/replaceFocusNodes'
import editorsEffects from './effects/editors'
import shapesEffects from './effects/shapes'
import resourcesEffects from './effects/resources'
import componentsEffects from './effects/components'
import type { Store } from '../../state'
import type { ComponentInstance } from '../components'

export interface PropertyObjectState<TState extends ComponentInstance = ComponentInstance> {
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

export interface LogicalConstraint<Type extends NamedNode = typeof sh.AndConstraintComponent | typeof sh.OrConstraintComponent | typeof sh.XoneConstraintComponent> {
  term: GraphPointer
  shapes: Shape[]
  component: Type
}

export interface LogicalConstraints {
  and: LogicalConstraint<typeof sh.AndConstraintComponent>[]
  or: LogicalConstraint<typeof sh.OrConstraintComponent>[]
  xone: LogicalConstraint<typeof sh.XoneConstraintComponent>[]
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
  hidden: boolean
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
  logicalConstraints: LogicalConstraints
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
  ...properties,
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
