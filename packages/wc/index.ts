/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc
 */

import type { TemplateResult } from 'lit'
import type * as Core from '@hydrofoil/shaperone-core'
import type { Component, ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import './ShaperoneForm'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit'

export type { SingleEditor, MultiEditor, Lazy } from '@hydrofoil/shaperone-core'

/**
 * Inherit to implement a `dash:SingleEditor` component rendered as Web Components using [lit](https://lit.polymer-project.org/)
 */
export type SingleEditorComponent<TState extends ComponentInstance = ComponentInstance> = Core.SingleEditorComponent<TState, TemplateResult>

/**
 * Inherit to implement a `dash:MultiEditor` component rendered as Web Components using [lit](https://lit.polymer-project.org/)
 */
export type MultiEditorComponent<TState extends ComponentInstance = ComponentInstance> = Core.MultiEditorComponent<TState, TemplateResult>

/**
 * Function interface for declaring a component's `.render` function which returns a [lit](https://lit.polymer-project.org/) template result
 */
export type Render<TComponent extends Component = Component> = Core.RenderComponent<TComponent, TemplateResult>
