/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/renderer
 */

import type { NodeShape, Shape } from '@rdfine/shacl'
import { PropertyGroup } from '@rdfine/shacl'
import type { NamedNode, Term } from '@rdfjs/types'
import type { GraphPointer, MultiPointer } from 'clownface'
import type { EditorsState } from './models/editors/index.js'
import type { FormState } from './models/forms/index.js'
import type { ComponentsState } from './models/components/index.js'
import type { Dispatch } from './state/index.js'
import { FocusNode } from './index.js'
import { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState } from './models/forms/index.js'
import { ShaperoneEnvironment } from './env.js'

/**
 * Base input parameters passed to the {@link Renderer}
 */
export interface RenderContext {
  /**
   * The RDF/JS environment
   */
  env: ShaperoneEnvironment
  /**
   * The unique symbol of the form
   */
  form: symbol
  /**
   * Editors model
   */
  editors: EditorsState
  /**
   * Detailed form state
   */
  state: FormState
  /**
   * Components model
   */
  components: ComponentsState
  /**
   * Object containing all possible function to change the state of the form, editors and components
   */
  dispatch: Dispatch
  /**
   * Shapes found in the shapes grah
   */
  shapes: NodeShape[]
}

/**
 * State mutation functions available to the {@link FormRenderer}
 */
export interface FormRenderActions {
  /**
   * Truncates the focus node stack by removing all focus nodes "above" the one in parameter
   * @param focusNode
   */
  truncateFocusNodes(focusNode: FocusNode): void

  /**
   * Removes the current focus node from the stack
   */
  popFocusNode(): void
}

/**
 * Partial renderer stage which renders the root of the form and can call child rendering of focus nodes
 */
export interface FormRenderer<TemplateResult = any> {
  context: RenderContext
  actions: FormRenderActions
  renderFocusNode(this: FormRenderer<TemplateResult>, args: { focusNode: FocusNode; shape?: NodeShape }): TemplateResult
}

/**
 * State mutation functions available to the {@link FocusNodeRenderer} (combined with {@link FormRenderActions})
 */
export interface FocusNodeActions {
  /**
   * Selects the given group so that only that group will be rendered by compatible implementation of {@link GroupRenderer}
   * @param group
   */
  selectGroup (group: PropertyGroup | undefined): void

  /**
   * Selects the given shape to be used for the current focus node
   * @param shape
   */
  selectShape (shape: NodeShape): void

  hideProperty (shape: Shape): void
  showProperty (shape: Shape): void

  clearProperty(shape: Shape): void
}

/**
 * Partial renderer stage which renders a focus node
 */
export interface FocusNodeRenderer<TemplateResult = any> extends FormRenderer<TemplateResult> {
  actions: FormRenderer['actions'] & FocusNodeActions
  focusNode: FocusNodeState
  renderGroup(this: FocusNodeRenderer<TemplateResult>, arg: { group: PropertyGroupState }): TemplateResult
}

/**
 * State mutation functions available to the {@link GroupRenderer} (combined with {@link FocusNodeActions})
 */
export interface GroupActions {
  /**
   * Selects the currently rendered group
   */
  selectGroup(): void
}

/**
 * Partial renderer stage which renders a group
 */
export interface GroupRenderer<TemplateResult = any> extends FocusNodeRenderer<TemplateResult> {
  actions: FocusNodeRenderer['actions'] & GroupActions
  group: PropertyGroupState
  renderProperty(this: GroupRenderer<TemplateResult>, arg: { property: PropertyState }): TemplateResult
}

/**
 * State mutation functions available to the {@link PropertyRenderer} (combined with {@link GroupActions})
 */
export interface PropertyActions {
  addObject(arg?: { overrides?: MultiPointer; componentState?: Record<string, unknown> }): void
  removeObject(object: Term | GraphPointer | PropertyObjectState): void
  selectMultiEditor(): void
  selectSingleEditors(): void
}

/**
 * Partial renderer stage which renders a property
 */
export interface PropertyRenderer<TemplateResult = any> extends GroupRenderer<TemplateResult> {
  actions: GroupRenderer['actions'] & PropertyActions
  property: PropertyState
  renderMultiEditor(this: PropertyRenderer<TemplateResult>): TemplateResult
  renderObject(this: PropertyRenderer<TemplateResult>, arg: { object: PropertyObjectState }): TemplateResult
}

/**
 * State mutation functions available to the {@link ObjectRenderer} (combined with {@link PropertyActions})
 */
export interface ObjectActions {
  /**
   * Selects the given editor to be used for the current object
   * @param editor
   */
  selectEditor(editor: NamedNode): void

  /**
   * Removes the current object from the form's graph
   */
  remove(): void
}

/**
 * Partial renderer stage which renders an object
 */
export interface ObjectRenderer<TemplateResult = any> extends PropertyRenderer<TemplateResult> {
  actions: PropertyRenderer['actions'] & ObjectActions
  object: PropertyObjectState
  renderEditor(this: ObjectRenderer<TemplateResult>): TemplateResult
}

/**
 * Base interface for implementing form renderers
 */
export interface Renderer<TRenderResult> {
  /**
   * Builds a complete form for given parameters
   * @param params
   */
  render(params: RenderContext): TRenderResult
}
