/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/forms
 */

import { createModel } from '@captaincodeman/rdx'
import { NamedNode } from 'rdf-js'
import type { NodeShape, PropertyGroup, PropertyShape, Shape, ValidationResult } from '@rdfine/shacl'
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
import * as validation from './reducers/validation'
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

export interface ValidationResultState {
  /**
   * Gets an rdfine OO representation of the underlying `sh:ValidationResult`
   */
  result: ValidationResult

  /**
   * Gets a value indicating whether the given validation result was correlated with a more specific point
   * in the [Data Graph](https://www.w3.org/TR/shacl/#data-graph). It will be null if a result could not
   * have been associated even with a Focus Node
   */
  matchedTo: 'focusNode' | 'property' | 'object' | null
}

/**
 * Represents validation results associated with a given location
 * in the form graph.
 *
 * Derived by other state models, narrows down the set of results
 */
export interface ValidationState {
  /**
   * Gets a collection of result objects which directly map to SHACL `sh:ValidationResult` nodes in the
   * validation result graph
   */
  validationResults: ValidationResultState[]
  /**
   * Gets a value indicating if any of the validation results has `sh:severity sh:Violation`
   */
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
  logicalConstraints: LogicalConstraints
}

export interface FormSettings {
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  languages: string[]
  labelProperties: NamedNode[]
}

export interface FormState extends FormSettings, ValidationState {
  focusNodes: Record<string, FocusNodeState>
  focusStack: FocusNode[]
  /**
   * Gets a pointer to the `sh:ValidationReport` instance
   */
  validationReport?: GraphPointer
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
