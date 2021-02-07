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
  (this: FocusNodeRenderer, args: {focusNode: FocusNodeState}): TemplateResult
}

export interface GroupTemplate extends RenderTemplate {
  (this: GroupRenderer, args: {properties: PropertyState[]}): TemplateResult
}

export interface PropertyTemplate extends RenderTemplate {
  (this: PropertyRenderer, args: { property: PropertyState }): TemplateResult
}

export interface ObjectTemplate extends RenderTemplate {
  (this: ObjectRenderer, arg: { object: PropertyObjectState }): TemplateResult
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
    const focusNodeTerm = focusStack[focusStack.length - 1]
    if (!focusNodeTerm) {
      return html``
    }

    const focusNode = focusNodes[focusNodeTerm.value]
    if (!focusNode) {
      return html``
    }

    return this.renderFocusNode({ focusNode })
  },
  focusNode({ focusNode }): TemplateResult {
    return html`<form>
    <div class="fieldset" part="focus-node">
        ${repeat(focusNode.groups, group => this.renderGroup({ group }))}
    </div>
</form>`
  },
  group({ properties }): TemplateResult {
    return html`${repeat(properties, property => this.renderProperty({ property }))}`
  },
  property({ property }): TemplateResult {
    return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${this.renderObject({ object })}</div>`)}`
  },
  object(): TemplateResult {
    return this.renderEditor()
  },
  initialising: () => html`Initialising form`,
}
