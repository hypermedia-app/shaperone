import type { FocusNodeState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { PropertyElement } from './index.js'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'

export class Sh1Property extends FindParentCustomElementRegistry(LitElement) implements PropertyElement {
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

  @property({ type: Object })
  public focusNode!: FocusNodeState

  @property({ type: Object })
  public property!: PropertyState

  render() {
    return html`
      <div class="label">
        <slot name="label">
          <label for="${this.property.shape.id.value}">
            ${localizedLabel(this.property.shape, { property: sh.name })}
          </label>
        </slot>
      </div>
      <div class="objects">
        <slot></slot>
        <slot name="add-object">
        </slot>
      </div>
    `
  }
}
