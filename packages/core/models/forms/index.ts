/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/forms
 */

import { createModel } from '@captaincodeman/rdx'
import type { NamedNode } from '@rdfjs/types'
import type { NodeKind, NodeShape, PropertyGroup, PropertyShape, Shape, ValidationResult } from '@rdfine/shacl'
import type { GraphPointer, MultiPointer } from 'clownface'
import type { sh } from '@tpluscode/rdf-ns-builders'
import effects from './effects/index.js'
import { addFormField } from './reducers/addFormField.js'
import { popFocusNode } from './reducers/popFocusNode.js'
import { removeObject } from './reducers/removeObject.js'
import { selectEditor } from './reducers/selectEditor.js'
import { selectGroup } from './reducers/selectGroup.js'
import { selectShape } from './reducers/selectShape.js'
import { truncateFocusNodes } from './reducers/truncateFocusNodes.js'
import * as objects from './reducers/updateObject.js'
import * as connection from './reducers/connection.js'
import * as editors from './reducers/editors.js'
import * as multiEditors from './reducers/multiEditors.js'
import * as validation from './reducers/validation.js'
import * as properties from './reducers/properties.js'
import type { FocusNode } from '../../index.js'
import type { SingleEditorMatch, MultiEditorMatch } from '../editors/index.js'
import { createFocusNodeState } from './reducers/replaceFocusNodes.js'
import editorsEffects from './effects/editors/index.js'
import shapesEffects from './effects/shapes/index.js'
import resourcesEffects from './effects/resources/index.js'
import componentsEffects from './effects/components/index.js'
import type { Store } from '../../state/index.js'
import type { ComponentInstance } from '../components/index.js'

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
  /**
   * An optional hint set when creating object state which will be used to override what kind of initial value is
   * created for the given object
   */
  nodeKind: NodeKind | undefined
  /**
   * A pointer to additional shape constraints passed to `addFormField`. For example, that could be a pointer on of
   * the properties `sh:in`
   */
  overrides: MultiPointer | undefined
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
  /**
   * @deprecated Property will be removed in a future version. Use taggedLiteral directive to display property name
   */
  name: string
  editors: MultiEditorMatch[]
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
