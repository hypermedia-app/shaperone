import { TemplateResult } from 'lit-html'
import type * as Core from '@hydrofoil/shaperone-core'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type { Lazy } from '@hydrofoil/shaperone-core'
export type SingleEditorComponent = Core.SingleEditorComponent<TemplateResult>
export type MultiEditorComponent = Core.MultiEditorComponent<TemplateResult>
export type RenderSingleEditor = Core.RenderSingleEditor<TemplateResult>
export type RenderMultiEditor = Core.RenderMultiEditor<TemplateResult>
