import { TemplateResult } from 'lit-html'
import type * as Core from '@hydrofoil/shaperone-core'
import type { TComponentState } from '@hydrofoil/shaperone-core/models/components'
import './ShaperoneForm'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type { Lazy } from '@hydrofoil/shaperone-core'
export type SingleEditorComponent<TState extends TComponentState = TComponentState> = Core.SingleEditorComponent<TState, TemplateResult>
export type MultiEditorComponent<TState extends TComponentState = TComponentState> = Core.MultiEditorComponent<TState, TemplateResult>
export type RenderSingleEditor<TState extends TComponentState = TComponentState> = Core.RenderSingleEditor<TState, TemplateResult>
export type RenderMultiEditor<TState extends TComponentState = TComponentState> = Core.RenderMultiEditor<TState, TemplateResult>
