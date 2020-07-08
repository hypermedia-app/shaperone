import { css, customElement, html, LitElement, query } from 'lit-element'
import type { Menu } from '@material/mwc-menu/mwc-menu'
import type { WcMenuButton } from 'wc-menu-button'

import '@material/mwc-menu/mwc-menu'
import 'wc-menu-button'

const menuCorner = 'END'

@customElement('wc-menu')
export class WcMenu extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      position: relative;
      --wc-menu-button-cursor: pointer;
    }

    wc-menu-button {
      width: 24px;
    }`
  }

  @query('mwc-menu')
  menu!: Menu

  @query('wc-menu-button')
  menuButton!: WcMenuButton

  render() {
    return html`<wc-menu-button @opened="${this.__open}" @closed="${this.__close}"></wc-menu-button>
      <mwc-menu quick @closed="${this.__closeButton}" .menuCorner="${menuCorner}" corner="TOP_END" .anchor="${this}">
        <slot></slot>
      </mwc-menu>`
  }

  __closeButton() {
    this.menuButton.open = false
  }

  __open() {
    this.menu.show()
  }

  __close() {
    this.menu.close()
  }
}
