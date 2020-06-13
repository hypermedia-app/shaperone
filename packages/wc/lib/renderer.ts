import { html } from 'lit-element'
import type { TemplateResult, CSSResult, CSSResultArray } from 'lit-element'
import type {
  FocusNodeState,
  FormState,
  PropertyGroupState,
  PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/state'
import type { NamedNode } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'
import type { PropertyGroup } from '@rdfine/shacl'
import type { FocusNode } from '@hydrofoil/shaperone-core'

export interface RenderStrategy {
  styles?: CSSResult | CSSResultArray
  loadDependencies?(): Array<Promise<unknown>>
}

interface FormRenderActions {
  truncateFocusNodes(focusNode: FocusNode): void
  popFocusNode(): void
}

export interface FormRenderStrategy extends RenderStrategy {
  (formState: FormState, actions: FormRenderActions, renderFocusNode: (focusNode: FocusNodeState) => TemplateResult): TemplateResult
}

interface FocusNodeRenderActions extends FormRenderActions {
  selectGroup(group: PropertyGroup | undefined): void
}

export interface FocusNodeRenderStrategy extends RenderStrategy {
  (focusNode: FocusNodeState, actions: FocusNodeRenderActions, renderGroup: (group: PropertyGroupState) => TemplateResult): TemplateResult
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

export interface PropertyRenderStrategy extends RenderStrategy {
  (property: PropertyState, actions: PropertyRenderActions, renderObject: (object: PropertyObjectState) => TemplateResult): TemplateResult
}

interface ObjectRenderActions {
  selectEditor(editor: NamedNode): void
  remove(): void
}

export interface ObjectRenderStrategy extends RenderStrategy {
  (object: PropertyObjectState, actions: ObjectRenderActions, renderEditor: () => TemplateResult): TemplateResult
}

export interface InitialisationStrategy extends RenderStrategy {
  (): TemplateResult | string
}

export const defaultFormRenderer: FormRenderStrategy = (state, actions, renderFocusNode) => {
  const { focusStack } = state
  const focusNode = focusStack[focusStack.length - 1]
  if (!focusNode) {
    return html``
  }

  const focusNodeState = state.focusNodes[focusNode.value]
  if (!focusNodeState) {
    return html``
  }

  return renderFocusNode(focusNodeState)
}

export const defaultFocusNodeRenderer: FocusNodeRenderStrategy = (focusNode, actions, renderGroup) => {
  return html`<form>
    <div class="fieldset">
        <legend>${focusNode.shape.getString(sh.name)}</legend>

        ${repeat(focusNode.groups, renderGroup)}
    </div>
</form>`
}

export const defaultGroupRenderer: GroupRenderStrategy = ({ properties, renderProperty }) => {
  return html`${repeat(properties, renderProperty)}`
}

export const defaultPropertyRenderer: PropertyRenderStrategy = (property, actions, renderObject) => {
  return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${renderObject(object)}`)}
</div>`
}

export const defaultObjectRenderer: ObjectRenderStrategy = (state, actions, editor) => {
  return editor()
}
