import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { html, LitElement } from 'lit'

export default class Sh1Group extends LitElement {
  @property({ type: Object })
  private group!: PropertyGroupState

  render() {
    return html`
      <slot></slot>`
  }
}
