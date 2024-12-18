import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { html, LitElement } from 'lit'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'

export default class Sh1Group extends FindParentCustomElementRegistry(LitElement) {
  @property({ type: Object })
  private group!: PropertyGroupState

  render() {
    return html`
      <slot></slot>`
  }
}
