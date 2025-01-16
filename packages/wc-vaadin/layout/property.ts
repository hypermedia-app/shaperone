import { PropertyElement } from '@hydrofoil/shaperone-wc/components/index.js'
import { css, html } from 'lit'

export default class extends PropertyElement {
  static get styles() {
    return css`
      sh1-object:not(:first-child) {
        --editor-label-visibility: hidden;
        top: -28px;
        position: relative;
        margin-bottom: -28px;
      }`
  }

  render() {
    return html`
      <div class="objects">
        ${this.renderObjects()}
        ${this.renderAddButton()}
      </div>
    `
  }
}
