import { css, html } from 'lit'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import { property } from 'lit/decorators.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { Dispatch } from '@hydrofoil/shaperone-core/state/index.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Object extends ShaperoneElementBase {
  dispatch: Dispatch | undefined

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }

  @property({ type: Object })
  private object!: PropertyObjectState

  @property({ type: Object })
  private focusNode!: FocusNodeState

  @property({ type: Object })
  private property!: PropertyState

  constructor() {
    super()

    this.addEventListener('value-changed', (e) => {
      const value = typeof e.detail.value === 'string'
        ? createTerm(this.property, e.detail.value)
        : e.detail.value

      this.dispatch?.form.updateObject({
        focusNode: this.focusNode.focusNode,
        property: this.property.shape,
        object: this.object,
        newValue: value,
      })
    })

    this.addEventListener('cleared', () => {
      this.dispatch?.form.clearValue({
        focusNode: this.focusNode.focusNode,
        property: this.property.shape,
        object: this.object,
      })
    })
  }

  render() {
    if (!this.object || !this.property || !this.focusNode) {
      return ''
    }

    return html`
      <slot>
        <dash-text-field
          .focusNode="${this.focusNode}"
          .property="${this.property}"
          .object="${this.object}"
        ></dash-text-field>
      </slot>
      <slot name="actions">
        <sh1-button ?hidden="${!this.property.canRemove}" @click=${this.removeObject}>×</sh1-button>
      </slot>
    `
  }

  removeObject() {
    this.dispatch?.form.removeObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
    })
  }
}
