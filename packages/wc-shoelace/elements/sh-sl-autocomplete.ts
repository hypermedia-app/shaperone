import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import { SlInput } from '@shoelace-style/shoelace'
import { stop } from '../lib/handlers.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'

@customElement('sh-sl-autocomplete')
export class ShSlAutocomplete extends LitElement {
  static get styles() {
    return css`
      [hidden] {
        display: none;
      }
    `
  }

  @property({ type: Object })
    selected?: GraphPointer

  @property({ type: String })
    inputValue = ''

  @property({ type: Boolean })
    empty = true

  @property({ type: Boolean })
    hoist = true

  @property({ type: Boolean })
  public readonly = false

  @query('sl-input')
    _input!: SlInput

  render() {
    return html`<sl-dropdown @sl-hide=${stop} ?hoist="${this.hoist}" .disabled="${this.readonly}">
      <sl-input slot="trigger"
                .value=${this.inputValue}
                @sl-input="${this.dispatchSearch}">
        <sl-icon name="search" slot="suffix"></sl-icon>
      </sl-input>
      <sl-menu hoist .value=${this.selected?.value}
               ?hidden="${this.empty}"
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
