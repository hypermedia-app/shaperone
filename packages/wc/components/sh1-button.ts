import { css, html, LitElement } from 'lit'

export default class extends LitElement {
  static get styles() {
    return css`
      button {
        background: none;
        border: 1px solid transparent;
        border-radius: 1px;
        padding: 2px 4px;
      }

      button:hover {
        border-color: black;
      }`
  }

  render() {
    return html`<button>
      <slot></slot>
    </button>`
  }
}
