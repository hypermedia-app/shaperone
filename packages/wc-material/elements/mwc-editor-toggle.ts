import { customElement, html, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'

import './wc-menu'
import '@material/mwc-icon/mwc-icon'
import '@material/mwc-list/mwc-list-item'
import { NamedNode } from 'rdf-js'
import { SelectableMenuMixin } from './SelectableMenuMixin'

@customElement('mwc-editor-toggle')
export class MwcEditorToggle extends SelectableMenuMixin(LitElement) {
  @property({ type: Array })
  editors: SingleEditorMatch[] = []

  @property({ type: Object })
  selected: NamedNode | undefined

  @property({ type: Boolean })
  removeEnabled = false

  render() {
    const removeButton = this.removeEnabled
      ? html`
        <li divider role="separator"></li>
        <mwc-list-item graphic="icon" @click="${this.__dispatchObjectRemoved}"><mwc-icon slot="graphic">delete</mwc-icon>Remove</mwc-list-item>`
      : html``

    return html`<wc-menu>
        ${repeat(this.editors, this.__renderEditorSelector.bind(this))}
        ${removeButton}
    </wc-menu>`
  }

  __renderEditorSelector(choice: SingleEditorMatch) {
    return this.createItem({
      text: choice.meta.label || choice.term.value,
      selected: choice.term.equals(this.selected),
      '@click': this.__dispatchEditorSelected(choice),
    })
  }

  __dispatchEditorSelected(choice: SingleEditorMatch) {
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
