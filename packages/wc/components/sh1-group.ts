import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { html, LitElement } from 'lit'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'
import { groupChanged } from '../lib/stateChanged.js'

export default class Sh1Group extends FindParentCustomElementRegistry(LitElement) {
  @property({ type: Object, hasChanged: groupChanged })
  private group!: PropertyGroupState

  render() {
    return html`
      <slot></slot>`
  }
}
