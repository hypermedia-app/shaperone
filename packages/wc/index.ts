import { TemplateResult } from 'lit-html'
import type * as Core from '@hydrofoil/shaperone-core'
import type { Component, ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import './ShaperoneForm'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type { SingleEditor, MultiEditor, Lazy } from '@hydrofoil/shaperone-core'
export type SingleEditorComponent<TState extends ComponentInstance = ComponentInstance> = Core.SingleEditorComponent<TState, TemplateResult>
export type MultiEditorComponent<TState extends ComponentInstance = ComponentInstance> = Core.MultiEditorComponent<TState, TemplateResult>
export type Render<TComponent extends Component = Component> = Core.RenderComponent<TComponent, TemplateResult>
