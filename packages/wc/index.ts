import { TemplateResult } from 'lit-html'
import type * as Core from '@hydrofoil/shaperone-core'
import './ShaperoneForm'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type { Lazy } from '@hydrofoil/shaperone-core'
export type SingleEditorComponent<TComponentState extends Record<string, any> = Record<string, any>> = Core.SingleEditorComponent<TComponentState, TemplateResult>
export type MultiEditorComponent<TComponentState extends Record<string, any> = Record<string, any>> = Core.MultiEditorComponent<TComponentState, TemplateResult>
export type RenderSingleEditor<TComponentState extends Record<string, any> = Record<string, any>> = Core.RenderSingleEditor<TComponentState, TemplateResult>
export type RenderMultiEditor<TComponentState extends Record<string, any> = Record<string, any>> = Core.RenderMultiEditor<TComponentState, TemplateResult>
