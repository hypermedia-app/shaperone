import { TemplateResult } from 'lit-html'
import type { Component as BaseComponent } from '@hydrofoil/shaperone-core'
import './ShaperoneForm'

export type { ShaperoneForm } from './ShaperoneForm'
export { html, css } from 'lit-element'

export type Component = BaseComponent<TemplateResult>
