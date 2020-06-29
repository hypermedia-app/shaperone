import { customElement, html, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { Editor } from '@hydrofoil/shaperone-core/models/editors'

import './wc-menu'
import '@material/mwc-list/mwc-list-item'

@customElement('mwc-editor-toggle')
export class MwcEditorToggle extends LitElement {
  @property({ type: Array })
  editors!: Editor[]

  render() {
    return html`<wc-menu>
        ${repeat(this.editors, this.__renderEditorSelector.bind(this))}
        <mwc-list-item @click="${this.__dispatchObjectRemoved}">Remove</mwc-list-item>
    </wc-menu>`
  }

  __renderEditorSelector(choice: Editor) {
    return html`<mwc-list-item @click="${this.__dispatchEditorSelected(choice)}">${choice.meta.label}</mwc-list-item></wc-menu>`
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
