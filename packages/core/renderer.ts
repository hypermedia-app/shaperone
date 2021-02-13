import type { NodeShape } from '@rdfine/shacl'
import { PropertyGroup } from '@rdfine/shacl'
import { NamedNode, Term } from 'rdf-js'
import type { GraphPointer } from 'clownface'
import type { EditorsState } from './models/editors'
import type { FormState } from './models/forms'
import type { ComponentsState } from './models/components'
import type { Dispatch } from './state'
import { FocusNode } from './index'
import { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState } from './models/forms'

export interface RenderContext {
  form: symbol
  editors: EditorsState
  state: FormState
  components: ComponentsState
  dispatch: Dispatch
  shapes: NodeShape[]
}

export interface FormRenderActions {
  truncateFocusNodes(focusNode: FocusNode): void
  popFocusNode(): void
}

export interface FormRenderer<TemplateResult = any> {
  context: RenderContext
  actions: FormRenderActions
  renderFocusNode(this: FormRenderer<TemplateResult>, args: { focusNode: FocusNode; shape?: NodeShape }): TemplateResult
}

export interface FocusNodeActions {
  selectGroup (group: PropertyGroup | undefined): void
  selectShape (shape: NodeShape): void
}

export interface FocusNodeRenderer<TemplateResult = any> extends FormRenderer<TemplateResult> {
  actions: FormRenderer['actions'] & FocusNodeActions
  focusNode: FocusNodeState
  renderGroup(this: FocusNodeRenderer<TemplateResult>, arg: { group: PropertyGroupState }): TemplateResult
}

export interface GroupActions {
  selectGroup(): void
}

export interface GroupRenderer<TemplateResult = any> extends FocusNodeRenderer<TemplateResult> {
  actions: FocusNodeRenderer['actions'] & GroupActions
  group: PropertyGroupState
  renderProperty(this: GroupRenderer<TemplateResult>, arg: { property: PropertyState }): TemplateResult
}

export interface PropertyActions {
  addObject(): void
  removeObject(object: Term | GraphPointer): void
  selectMultiEditor(): void
  selectSingleEditors(): void
}

export interface PropertyRenderer<TemplateResult = any> extends GroupRenderer<TemplateResult> {
  actions: GroupRenderer['actions'] & PropertyActions
  property: PropertyState
  renderMultiEditor(this: PropertyRenderer<TemplateResult>): TemplateResult
  renderObject(this: PropertyRenderer<TemplateResult>, arg: { object: PropertyObjectState }): TemplateResult
}

export interface ObjectActions {
  selectEditor(editor: NamedNode): void
  remove(): void
}

export interface ObjectRenderer<TemplateResult = any> extends PropertyRenderer<TemplateResult> {
  actions: PropertyRenderer['actions'] & ObjectActions
  object: PropertyObjectState
  renderEditor(this: ObjectRenderer<TemplateResult>): TemplateResult
}

export interface Renderer<TRenderResult> {
  render(params: RenderContext): TRenderResult
}
