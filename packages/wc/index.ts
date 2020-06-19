import { TemplateResult } from 'lit-html'
import { Component as BaseComponent } from '@hydrofoil/shaperone-core/components'

export { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type Component = BaseComponent<TemplateResult>
