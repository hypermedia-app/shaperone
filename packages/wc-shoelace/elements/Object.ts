import { css } from 'lit'
import { ObjectElement } from '@hydrofoil/shaperone-wc/components/index.js'

export default class extends ObjectElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
      }

      slot.editor {
        display: block;
        flex: 1 ;
      }

      sl-icon-button {
        font-size: var(--sh-sl-icon-size, 1.75em)
      }
    `
  }
}
