import { css, customElement, html, LitElement, property, query } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { EditorMatch } from '@hydrofoil/shaperone-core/lib/editorMatcher'
import type { Menu } from '@material/mwc-menu/mwc-menu'
import type { WcMenuButton } from 'wc-menu-button'

import '@material/mwc-menu/mwc-menu'
import '@material/mwc-list/mwc-list-item'
import 'wc-menu-button'

@customElement('mwc-editor-toggle')
export class MwcEditorToggle extends LitElement {
  static get styles() {
    return css`wc-menu-button {
      width: 24px;
    }`
  }

  @query('mwc-menu')
  menu!: Menu

  @query('wc-menu-button')
  menuButton!: WcMenuButton

  @property({ type: Array })
  editors!: EditorMatch[]

  render() {
    return html`<wc-menu-button @opened="${this.__open}" @closed="${this.__close}"></wc-menu-button>
      <mwc-menu quick @closed="${this.__closeButton}">
        ${repeat(this.editors, this.__renderEditorSelector.bind(this))}
        <mwc-list-item @click="${this.__dispatchObjectRemoved}">Remove</mwc-list-item>
      </mwc-menu>`
  }

  __renderEditorSelector(choice: EditorMatch) {
    return html`<mwc-list-item @click="${this.__dispatchEditorSelected(choice)}">${choice.label}</mwc-list-item>`
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

  __dispatchEditorSelected(choice: EditorMatch) {
    return () => {
      this.dispatchEvent(new CustomEvent('editor-selected', {
        detail: {
          editor: choice.editor,
        },
      }))
    }
  }

  __dispatchObjectRemoved() {
    this.dispatchEvent(new CustomEvent('object-removed'))
  }
}
