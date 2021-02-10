import { CSSResult, CSSResultArray, html, TemplateResult } from 'lit-element'
import { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { repeat } from 'lit-html/directives/repeat'
import type { FocusNodeRenderer, FormRenderer, GroupRenderer, ObjectRenderer, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { NamedNode } from 'rdf-js'
import type { GraphPointer } from 'clownface'

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

export interface EditorTemplates {
  notFound(): TemplateResult
  label(this: FormRenderer, editor: NamedNode): string
}

export interface ComponentTemplates {
  notFound(this: PropertyRenderer, editor: NamedNode): TemplateResult
  loading(): TemplateResult
  loadingFailed(reason: string): TemplateResult
  initializing(): TemplateResult
}

interface MetaTemplates {
  label(this: FormRenderer, term: GraphPointer | undefined, fallback?: string): string
}

export interface RenderTemplates {
  initialising(): TemplateResult
  form: FormTemplate
  focusNode: FocusNodeTemplate
  group: GroupTemplate
  property: PropertyTemplate
  object: ObjectTemplate
  editor: EditorTemplates
  component: ComponentTemplates
  meta: MetaTemplates
}

export const templates: RenderTemplates = {
  meta: {
    label(this: FormRenderer, term: GraphPointer | undefined): string {
      const { labelProperties, languages } = this.context.state

      return term?.out(labelProperties, { language: [...languages, ''] }).values[0] || term?.value || 'no label'
    },
  },
  editor: {
    notFound: () => html`No editor found for property`,
    label(this: FormRenderer, editor: NamedNode) {
      const ptr = this.context.editors.metadata.node(editor)
      return this.context.templates.meta.label.call(this, ptr)
    },
  },
  component: {
    notFound(this: PropertyRenderer, editor: NamedNode) {
      const { templates, editors: { metadata } } = this.context

      return html`No component found for ${templates.meta.label.call(this, metadata.node(editor)) || editor.value}`
    },
    loading() {
      return html`Loading editor`
    },
    loadingFailed() {
      return html`Failed to load editor`
    },
    initializing() {
      return html`Initialising component`
    },
  },
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
    const label = this.meta.label.call(renderer, property.shape.pointer)

    return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${label}</label>
    ${renderer.renderObject({ object })}</div>`)}`
  },
  object(renderer): TemplateResult {
    return renderer.renderEditor()
  },
  initialising: () => html`Initialising form`,
}
