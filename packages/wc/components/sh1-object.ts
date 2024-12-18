import { css, html, LitElement } from 'lit'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import { property } from 'lit/decorators.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { Dispatch } from '@hydrofoil/shaperone-core/state/index.js'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'

export class Sh1Object extends FindParentCustomElementRegistry(LitElement) {
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

      e.stopPropagation()
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
      <slot name="remove-object">
      </slot>
    `
  }
}
