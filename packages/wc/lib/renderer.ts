import { html } from 'lit-element'
import type { TemplateResult, CSSResult, CSSResultArray } from 'lit-element'
import type {
  FocusNodeState,
  FormState,
  PropertyGroupState,
  PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/models/forms'
import type { NamedNode } from 'rdf-js'
import { repeat } from 'lit-html/directives/repeat'
import type { NodeShape, PropertyGroup } from '@rdfine/shacl'
import type { FocusNode } from '@hydrofoil/shaperone-core'

export interface RenderStrategy {
  styles?: CSSResult | CSSResultArray
  loadDependencies?(): Array<Promise<unknown>>
}

interface FormRenderActions {
  truncateFocusNodes(focusNode: FocusNode): void
  popFocusNode(): void
}

interface FormRenderParams {
  form: FormState
  actions: FormRenderActions
  renderFocusNode: (focusNode: FocusNodeState) => TemplateResult
}

export interface FormRenderStrategy extends RenderStrategy {
  (params: FormRenderParams): TemplateResult
}

interface FocusNodeRenderActions extends FormRenderActions {
  selectGroup(group: PropertyGroup | undefined): void
  selectShape(shape: NodeShape): void
}

interface FocusNodeRenderParams {
  focusNode: FocusNodeState
  actions: FocusNodeRenderActions
  renderGroup: (group: PropertyGroupState) => TemplateResult
}

export interface FocusNodeRenderStrategy extends RenderStrategy {
  (params: FocusNodeRenderParams): TemplateResult
}

interface GroupRenderParams {
  group: PropertyGroupState
  properties: PropertyState[]
  actions: {
    selectGroup(): void
  }
  renderProperty(property: PropertyState): TemplateResult
}

export interface GroupRenderStrategy extends RenderStrategy {
  (params: GroupRenderParams): TemplateResult
}

interface PropertyRenderActions {
  addObject(): void
}

interface PropertyRenderParams {
  property: PropertyState
  actions: PropertyRenderActions
  renderObject: (object: PropertyObjectState) => TemplateResult
}

export interface PropertyRenderStrategy extends RenderStrategy {
  (params: PropertyRenderParams): TemplateResult
}

interface ObjectRenderActions {
  selectEditor(editor: NamedNode): void
  remove(): void
}

interface ObjectRenderParams {
  object: PropertyObjectState
  actions: ObjectRenderActions
  renderEditor: () => TemplateResult
}

export interface ObjectRenderStrategy extends RenderStrategy {
  (params: ObjectRenderParams): TemplateResult
}

export interface InitialisationStrategy extends RenderStrategy {
  (): TemplateResult | string
}

export const defaultFormRenderer: FormRenderStrategy = ({ form, renderFocusNode }) => {
  const { focusStack } = form
  const focusNode = focusStack[focusStack.length - 1]
  if (!focusNode) {
    return html``
  }

  const focusNodeState = form.focusNodes[focusNode.value]
  if (!focusNodeState) {
    return html``
  }

  return renderFocusNode(focusNodeState)
}

export const defaultFocusNodeRenderer: FocusNodeRenderStrategy = ({ focusNode, renderGroup }) => {
  return html`<form>
    <div class="fieldset">
        ${repeat(focusNode.groups, renderGroup)}
    </div>
</form>`
}

export const defaultGroupRenderer: GroupRenderStrategy = ({ properties, renderProperty }) => {
  return html`${repeat(properties, renderProperty)}`
}

export const defaultPropertyRenderer: PropertyRenderStrategy = ({ property, renderObject }) => {
  return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${renderObject(object)}`)}
</div>`
}

export const defaultObjectRenderer: ObjectRenderStrategy = ({ renderEditor }) => {
  return renderEditor()
}
