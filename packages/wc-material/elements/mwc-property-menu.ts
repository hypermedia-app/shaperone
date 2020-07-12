import { css, customElement, html, LitElement, property } from 'lit-element'

import './wc-menu'
import '@material/mwc-icon/mwc-icon'
import '@material/mwc-list/mwc-list-item'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

@customElement('mwc-property-menu')
export class MwcPropertyMenu extends LitElement {
  static get styles() {
    return css`mwc-list-item.toggle:not([current]) {
      display: none;
    }`
  }

  @property({ type: Object })
  property!: PropertyState

  render() {
    return html`<wc-menu>
        <mwc-list-item class="toggle" graphic="icon"
                      @click="${this.__dispatch('multi-editor-selected')}"
                      ?current="${!this.property.selectedEditor}">
            <mwc-icon slot="graphic">wysiwyg</mwc-icon>
            Multi editor
        </mwc-list-item>
        <mwc-list-item class="toggle" graphic="icon"
                      @click="${this.__dispatch('single-editors-selected')}"
                      ?current="${this.property.selectedEditor}">
            <mwc-icon slot="graphic">list</mwc-icon>
            Individual editors
        </mwc-list-item>
    </wc-menu>`
  }

  __dispatch(ev: string) {
    return () => {
      this.dispatchEvent(new CustomEvent(ev))
    }
  }
}
