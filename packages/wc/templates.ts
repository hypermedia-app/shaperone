import { CSSResult, CSSResultArray, html, TemplateResult } from 'lit-element'
import { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { repeat } from 'lit-html/directives/repeat'
import type { FocusNodeRenderer, FormRenderer, GroupRenderer, ObjectRenderer, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'

export interface RenderTemplate {
  styles?: CSSResult | CSSResultArray
  loadDependencies?(): Array<Promise<unknown>>
}

export interface FormTemplate extends RenderTemplate {
  (context: FormRenderer): TemplateResult
}

export interface FocusNodeTemplate extends RenderTemplate {
  (context: FocusNodeRenderer, args: {focusNode: FocusNodeState}): TemplateResult
}

export interface GroupTemplate extends RenderTemplate {
  (context: GroupRenderer, args: {properties: PropertyState[]}): TemplateResult
}

export interface PropertyTemplate extends RenderTemplate {
  (context: PropertyRenderer, args: { property: PropertyState }): TemplateResult
}

export interface ObjectTemplate extends RenderTemplate {
  (context: ObjectRenderer, arg: { object: PropertyObjectState }): TemplateResult
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
  form(renderer) {
    const { focusStack } = renderer.context.state
    const focusNode = focusStack[focusStack.length - 1]
    if (!focusNode) {
      return html``
    }

    return renderer.renderFocusNode({ focusNode })
  },
  focusNode(renderer, { focusNode }): TemplateResult {
    return html`<form>
    <div class="fieldset" part="focus-node">
        ${repeat(focusNode.groups, group => renderer.renderGroup({ group }))}
    </div>
</form>`
  },
  group(renderer, { properties }): TemplateResult {
    return html`${repeat(properties, property => renderer.renderProperty({ property }))}`
  },
  property(renderer, { property }): TemplateResult {
    return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${renderer.renderObject({ object })}</div>`)}`
  },
  object(renderer): TemplateResult {
    return renderer.renderEditor()
  },
  initialising: () => html`Initialising form`,
}
