import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('sh-sl-object')
export class ShaperoneShoelaceObject extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
      }

      slot {
        display: block;
        flex: 1 ;
      }

      sl-icon-button {
        font-size: var(--sh-sl-icon-size, 1.75em)
      }
    `
  }

  @property({ type: Boolean })
    canBeRemoved?: boolean

  @property({ type: String })
    removeIcon?: string

  render() {
    let removeRow = html``
    if (this.canBeRemoved) {
      removeRow = html`<sl-icon-button name="${this.removeIcon || 'x-square'}"
                                       label="Remove value"
                                       @click="${() => this.dispatchEvent(new Event('removed'))}"></sl-icon-button>`
    }
    return html`
      <slot></slot>
      ${removeRow}
    `
  }
}
