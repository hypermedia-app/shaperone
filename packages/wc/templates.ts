/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/templates
 */

import type { CSSResult, TemplateResult, CSSResultGroup } from 'lit'
import { html } from 'lit'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { repeat } from 'lit/directives/repeat.js'
import type { FocusNodeRenderer, FormRenderer, GroupRenderer, ObjectRenderer, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import type { NamedNode } from '@rdfjs/types'
import { sh } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

export * from './renderer/decorator.js'

/**
 * Base template. Extend to create templates which can dynamically load dependencies or inject CSS styles
 */
export interface RenderTemplate {
  /**
   * All styles get combined and inserted into the form
   */
  styles?: CSSResult | CSSResultGroup

  /**
   * Gets called by the renderer when the form is initialised
   */
  loadDependencies?(): Array<Promise<unknown>>
}

/**
 * Renders the form
 */
export interface FormTemplate extends RenderTemplate {
  (context: FormRenderer): TemplateResult
}

/**
 * Renders a focus node
 */
export interface FocusNodeTemplate extends RenderTemplate {
  (context: FocusNodeRenderer, args: {focusNode: FocusNodeState}): TemplateResult
}

/**
 * Renders an object of a group of properties
 */
export interface GroupTemplate extends RenderTemplate {
  (context: GroupRenderer, args: {properties: PropertyState[]}): TemplateResult
}

/**
 * Renders an object of a property
 */
export interface PropertyTemplate extends RenderTemplate {
  (context: PropertyRenderer, args: { property: PropertyState }): TemplateResult
}

/**
 * Renders an object of a property
 */
export interface ObjectTemplate extends RenderTemplate {
  (context: ObjectRenderer, arg: { object: PropertyObjectState }): TemplateResult
}

/**
 * Templates related to editors
 */
export interface EditorTemplates {
  notFound(): TemplateResult
}

/**
 * Templates related to rendering components
 */
export interface ComponentTemplates {
  notFound(this: PropertyRenderer, editor: NamedNode): TemplateResult
  loading(): TemplateResult
  loadingFailed(reason: string): TemplateResult
  initializing(): TemplateResult
}

/**
 * Default set of templates which can be called from the renderer to
 * build the final HTML output from reusable parts
 */
export interface RenderTemplates {
  /**
   * Rendered when the form is preparing
   */
  initialising(): TemplateResult
  form: FormTemplate
  focusNode: FocusNodeTemplate
  group: GroupTemplate
  property: PropertyTemplate
  object: ObjectTemplate
  editor: EditorTemplates
  component: ComponentTemplates
}

/**
 * Default implementation of {@link RenderTemplates} which outputs native HTML elements
 */
export const templates: RenderTemplates = {
  editor: {
    notFound: () => html`No editor found for property`,
  },
  component: {
    notFound(this: PropertyRenderer, editor: NamedNode) {
      const { editors } = this.context

      return html`No component found for ${localizedLabel(editors.allEditors[editor.value]?.meta, { fallback: editor.value })}`
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
    return html`${repeat(property.objects, object => html`<div class="field">
    <label for="${property.shape.id.value}">${localizedLabel(property.shape, { property: sh.name })}</label>
    ${renderer.renderObject({ object })}</div>`)}`
  },
  object(renderer): TemplateResult {
    return renderer.renderEditor()
  },
  initialising: () => html`Initialising form`,
}
