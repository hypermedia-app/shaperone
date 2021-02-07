import { EditorsState } from '@hydrofoil/shaperone-core/models/editors'
import {
  FocusNodeState,
  FormState,
  PropertyGroupState,
  PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/models/forms'
import { ComponentsState } from '@hydrofoil/shaperone-core/models/components'
import { NodeShape, PropertyGroup } from '@rdfine/shacl'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { TemplateResult } from 'lit-element'
import { NamedNode } from 'rdf-js'
import { RenderTemplates } from './templates'
import { Dispatch } from './store'

export interface RenderContext {
  form: symbol
  editors: EditorsState
  state: FormState
  components: ComponentsState
  dispatch: Dispatch
  templates: RenderTemplates
  shapes: NodeShape[]
}

export interface FormRenderActions {
  truncateFocusNodes(focusNode: FocusNode): void
  popFocusNode(): void
}

export interface FormRenderer {
  context: RenderContext
  actions: FormRenderActions
  focusNode(this: FormRenderer, args: { focusNodeState: FocusNodeState }): TemplateResult
}

export interface FocusNodeActions {
  selectGroup (group: PropertyGroup | undefined): void
  selectShape (shape: NodeShape): void
}

export interface FocusNodeRenderer extends FormRenderer {
  actions: FormRenderer['actions'] & FocusNodeActions
  focusNodeState: FocusNodeState
  group(this: FocusNodeRenderer, arg: { groupState: PropertyGroupState }): TemplateResult
}

export interface GroupActions {
  selectGroup(): void
}

export interface GroupRenderer extends FocusNodeRenderer {
  actions: FocusNodeRenderer['actions'] & GroupActions
  groupState: PropertyGroupState
  property(this: GroupRenderer, arg: { property: PropertyState }): TemplateResult
}

export interface PropertyActions {
  addObject(): void
  selectMultiEditor(): void
  selectSingleEditors(): void
}

export interface PropertyRenderer extends GroupRenderer {
  actions: GroupRenderer['actions'] & PropertyActions
  propertyState: PropertyState
  multiEditor(this: PropertyRenderer): TemplateResult
  object(this: PropertyRenderer, arg: { value: PropertyObjectState }): TemplateResult
}

export interface ObjectActions {
  selectEditor(editor: NamedNode): void
  remove(): void
}

export interface ObjectRenderer extends PropertyRenderer {
  actions: PropertyRenderer['actions'] & ObjectActions
  objectState: PropertyObjectState
  editor(this: ObjectRenderer): TemplateResult
}

export interface Renderer {
  render(params: RenderContext): TemplateResult
}
