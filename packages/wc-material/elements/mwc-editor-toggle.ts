import { customElement, html, LitElement, property, css } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { Editor } from '@hydrofoil/shaperone-core/models/editors'

import './wc-menu'
import '@material/mwc-icon/mwc-icon'
import '@material/mwc-list/mwc-list-item'
import { NamedNode } from 'rdf-js'

@customElement('mwc-editor-toggle')
export class MwcEditorToggle extends LitElement {
  static get styles() {
    return css`mwc-list-item:not([selected]) mwc-icon {
      display: none
    }`
  }

  @property({ type: Array })
  editors!: Editor[]

  @property({ type: Object })
  selected!: NamedNode

  @property({ type: Boolean })
  removeEnabled = false

  render() {
    const removeButton = this.removeEnabled ? html`
        <li divider role="separator"></li>
        <mwc-list-item @click="${this.__dispatchObjectRemoved}">Remove</mwc-list-item>` : html``

    return html`<wc-menu>
        ${repeat(this.editors, this.__renderEditorSelector.bind(this))}
        ${removeButton}
    </wc-menu>`
  }

  __renderEditorSelector(choice: Editor) {
    return html`<mwc-list-item graphic="icon" @click="${this.__dispatchEditorSelected(choice)}" ?selected="${choice.term.equals(this.selected)}">
        <mwc-icon slot="graphic">check</mwc-icon>
        ${choice.meta.label}
    </mwc-list-item></wc-menu>`
  }

  __dispatchEditorSelected(choice: Editor) {
    return () => {
      this.dispatchEvent(new CustomEvent('editor-selected', {
        detail: {
          editor: choice.term,
        },
      }))
    }
  }

  __dispatchObjectRemoved() {
    this.dispatchEvent(new CustomEvent('object-removed'))
  }
}
