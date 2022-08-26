import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import { SlInput } from '@shoelace-style/shoelace'
import { stop } from '../lib/handlers.js'

@customElement('sh-sl-autocomplete')
export class ShSlAutocomplete extends LitElement {
  static get styles() {
    return css`
      :host([empty]) sl-menu {
        display: none;
      }
    `
  }

  @property({ type: Object })
  selected?: GraphPointer

  @property({ type: String })
  inputValue = ''

  @property({ type: Boolean, reflect: true })
  empty = true

  @query('sl-input')
  _input!: SlInput

  render() {
    return html`<sl-dropdown @sl-hide=${stop} hoist>
      <sl-input slot="trigger"
                .value=${this.inputValue}
                @sl-input="${this.dispatchSearch}">
        <sl-icon name="search" slot="suffix"></sl-icon>
      </sl-input>
      <sl-menu hoist .value=${this.selected?.value}
               placeholder="Missing data!"
               @sl-select=${this.dispatchItemSelected}>
        <slot @slotchange=${this.updateEmpty}></slot>
      </sl-menu>
    </sl-dropdown>
    `
  }

  updateEmpty(e: Event) {
    const slot = e.target as HTMLSlotElement
    this.empty = slot.assignedElements().length === 0
  }

  dispatchSearch() {
    this.dispatchEvent(new CustomEvent('search', {
      detail: {
        value: this._input.value,
      },
    }))
  }

  dispatchItemSelected(e: CustomEvent) {
    this.dispatchEvent(new CustomEvent('itemSelected', {
      detail: {
        value: e.detail.item.value,
      },
    }))
  }
}
