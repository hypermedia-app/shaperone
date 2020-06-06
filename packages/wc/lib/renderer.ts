import { html } from 'lit-element'
import type { TemplateResult, CSSResult, CSSResultArray } from 'lit-element'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/state'
import type { NamedNode } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'
import type { PropertyGroup } from '@rdfine/shacl'
import { byGroup } from '@hydrofoil/shaperone-core/lib/filter'

export interface RenderStrategy {
  styles?: CSSResult | CSSResultArray
  loadDependencies?(): Array<Promise<unknown>>
}

export interface FormRenderStrategy extends RenderStrategy {
  (formState: FocusNodeState, renderGroup: (group: PropertyGroup | undefined, properties: PropertyState[]) => TemplateResult): TemplateResult
}

export interface GroupRenderStrategy extends RenderStrategy {
  (group: PropertyGroup | undefined, properties: PropertyState[], renderProperty: (property: PropertyState) => TemplateResult): TemplateResult
}

export interface PropertyRenderStrategy extends RenderStrategy {
  (property: PropertyState, renderObject: (object: PropertyObjectState) => TemplateResult, actions: {
    addObject(): void
  }): TemplateResult
}

export interface ObjectRenderStrategy extends RenderStrategy {
  (object: PropertyObjectState, renderEditor: () => TemplateResult, actions: {
    selectEditor(editor: NamedNode): void
    remove(): void
  }): TemplateResult
}

export interface InitialisationStrategy extends RenderStrategy {
  (): TemplateResult | string
}

export const defaultFormRenderer: FormRenderStrategy = (formState, renderGroup) => {
  return html`<form>
    <div class="fieldset">
        <legend>${formState.shape.getString(sh.name)}</legend>

        ${repeat(formState.groups, group => renderGroup(group, formState.properties.filter(byGroup(group))))}
    </div>
</form>`
}

export const defaultGroupRenderer: GroupRenderStrategy = (group, properties, render) => {
  return html`${repeat(properties, render)}`
}

export const defaultPropertyRenderer: PropertyRenderStrategy = (property, renderObject) => {
  return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${property.name}</label>
    ${renderObject(object)}`)}
</div>`
}

export const defaultObjectRenderer: ObjectRenderStrategy = (state, editor) => {
  return editor()
}
