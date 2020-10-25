import { TemplateResult } from 'lit-html'
import type * as Core from '@hydrofoil/shaperone-core'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type Component = Core.Component<TemplateResult>
export type SingleEditorComponent = Core.SingleEditorComponent<TemplateResult>
export type MultiEditorComponent = Core.MultiEditorComponent<TemplateResult>
