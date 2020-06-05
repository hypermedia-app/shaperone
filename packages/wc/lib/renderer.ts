import { html } from 'lit-element'
import type { TemplateResult, CSSResult, CSSResultArray } from 'lit-element'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/state'
import type { NamedNode, Term } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'
import type { PropertyGroup } from '@rdfine/shacl'
import { EditorMap } from './components'
import { byGroup } from '@hydrofoil/shaperone-core/lib/filter'

export interface FormRenderStrategy {
  (formState: FocusNodeState, renderGroup: (group: PropertyGroup | undefined, properties: PropertyState[]) => TemplateResult): TemplateResult
  styles?: CSSResult | CSSResultArray
}

export interface GroupRenderStrategy {
  (group: PropertyGroup | undefined, properties: PropertyState[], renderProperty: (property: PropertyState) => TemplateResult): TemplateResult
  styles?: CSSResult | CSSResultArray
}

export interface PropertyRenderStrategy {
  (property: PropertyState, renderObject: (object: PropertyObjectState) => TemplateResult, actions: {
    addObject(): void
  }): TemplateResult
  styles?: CSSResult | CSSResultArray
}

export interface ObjectRenderStrategy {
  (object: PropertyObjectState, renderEditor: () => TemplateResult, actions: {
    selectEditor(editor: NamedNode): void
    remove(): void
  }): TemplateResult
  styles?: CSSResult | CSSResultArray
}

export interface EditorRenderStrategy {
  (components: EditorMap, property: PropertyState, value: PropertyObjectState, actions: {
    update(newValue: Term): void
  }): TemplateResult
}

export const defaultEditorRender: EditorRenderStrategy = (components, property, value, { update }) => {
  const componentFactory = components.get(value.selectedEditor)
  if (!componentFactory) {
    return html`No editor found for property`
  }

  return componentFactory({
    property,
    value,
    update,
  })
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
