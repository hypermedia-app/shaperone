import { css, html } from 'lit'
import { PropertyElement } from '@hydrofoil/shaperone-wc/components/index.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'

export default class extends PropertyElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        --sh-sl-label-font-size: var(--sl-font-size-medium);
        --sh-sl-help-text-font-size: var(--sl-font-size-small);
        --sh-sl-help-text-color: var(--sl-color-neutral-500);
      }

      slot::slotted(*) {
        padding: var(--sh-sl-property-object-padding, 0 0 10px);
      }

      #label {
        font-size: var(--sh-sl-label-font-size);
      }

      #help-text {
        margin-top: 0;
        font-size: var(--sh-sl-help-text-font-size);
        color: var(--sh-sl-help-text-color);
      }

      slot.empty + #help-text {
        margin-top: -1em;
      }
    `
  }

  render() {
    let helpText: any = ''
    if (this.property.shape.description) {
      helpText = html`<p id="help-text">${localizedLabel(this.property.shape, { property: sh.description })}</p>`
    }

    return html`
      <p id="label">${localizedLabel(this.property.shape, { property: sh.name })}</p>
      <div id="objects">
        ${this.renderObjects()}
      </div>
      ${helpText}
      ${this.renderAddButton()}
    `
  }
}
