import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { html } from 'lit'
import { groupChanged } from '../lib/stateChanged.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export default class Sh1Group extends ShaperoneElementBase {
  @property({ type: Object, hasChanged: groupChanged })
  private group!: PropertyGroupState

  render() {
    return html`
      <slot></slot>`
  }
}
