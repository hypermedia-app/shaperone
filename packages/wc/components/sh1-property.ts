import type { FocusNodeState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { PropertyValues } from 'lit'
import { css, html } from 'lit'
import { property } from 'lit/decorators.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { Dispatch } from '@hydrofoil/shaperone-core/state/index.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Property extends ShaperoneElementBase {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-content: space-between;
      }

      .label {
        flex: 1;
      }

      .objects {
        text-align: end;
      }

      :host(:not([can-add])) slot[name=add-object] {
        display: none;
      }
    `
  }

  private dispatch!: Dispatch | undefined

  @property({ type: Object })
  private focusNode!: FocusNodeState

  @property({ type: Object })
  private property!: PropertyState

  @property({ type: Boolean, reflect: true, attribute: 'can-add', state: true })
  private canAdd = false

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('property')) {
      this.canAdd = this.property.canAdd
    }
  }

  render() {
    return html`
      <div class="label">
        <slot name="label">
          <label for="${this.property.shape.id.value}">
            ${this.propertyLabel}
          </label>
        </slot>
      </div>
      <div class="objects">
        <slot></slot>
        <slot name="add-object">
          <sh1-button @click=${this.addObject}>
            + ${this.propertyLabel}
          </sh1-button>
        </slot>
      </div>
    `
  }

  addObject() {
    this.dispatch?.form.addObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  get propertyLabel() {
    return html`${localizedLabel(this.property.shape, { property: sh.name })}`
  }
}
