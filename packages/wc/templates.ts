import { CSSResult, CSSResultArray, html, TemplateResult } from 'lit-element'
import { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { repeat } from 'lit-html/directives/repeat'
import type { FocusNodeRenderer, FormRenderer, GroupRenderer, ObjectRenderer, PropertyRenderer } from './renderer'

export interface RenderTemplate {
  styles?: CSSResult | CSSResultArray
  loadDependencies?(): Array<Promise<unknown>>
}

export interface FormTemplate extends RenderTemplate {
  (this: FormRenderer): TemplateResult
}

export interface FocusNodeTemplate extends RenderTemplate {
  (this: FocusNodeRenderer, args: {focusNodeState: FocusNodeState}): TemplateResult
}

export interface GroupTemplate extends RenderTemplate {
  (this: GroupRenderer, args: {properties: PropertyState[]}): TemplateResult
}

export interface PropertyTemplate extends RenderTemplate {
  (this: PropertyRenderer, args: { property: PropertyState }): TemplateResult
}

export interface ObjectTemplate extends RenderTemplate {
  (this: ObjectRenderer, arg: { value: PropertyObjectState }): TemplateResult
}

export interface RenderTemplates {
  initialising(): TemplateResult
  form: FormTemplate
  focusNode: FocusNodeTemplate
  group: GroupTemplate
  property: PropertyTemplate
  object: ObjectTemplate
}

export const templates: RenderTemplates = {
  form() {
    const { focusStack, focusNodes } = this.context.state
    const focusNode = focusStack[focusStack.length - 1]
    if (!focusNode) {
      return html``
    }

    const focusNodeState = focusNodes[focusNode.value]
    if (!focusNodeState) {
      return html``
    }

    return this.focusNode({ focusNodeState })
  },
  focusNode({ focusNodeState }): TemplateResult {
    return html`<form>
    <div class="fieldset" part="focus-node">
        ${repeat(focusNodeState.groups, groupState => this.group({ groupState }))}
    </div>
</form>`
  },
  group({ properties }): TemplateResult {
    return html`${repeat(properties, property => this.property({ property }))}`
  },
  property({ property }): TemplateResult {
    return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${this.object({ value: object })}</div>`)}`
  },
  object(): TemplateResult {
    return this.editor()
  },
  initialising: () => html`Initialising form`,
}
