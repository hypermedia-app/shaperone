import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import { SlDropdown, SlInput } from '@shoelace-style/shoelace'
import debounce from 'p-debounce'
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

      :host([loading]) sl-input sl-icon {
        animation-name: spin;
        animation-duration: 500ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      @keyframes spin {
        from {
          transform:rotate(0deg);
        }
        to {
          transform:rotate(360deg);
        }
      }

      sl-input sl-icon[slot=suffix] {
        padding-right: 0;
        margin-right: var(--sl-input-spacing-medium);
      }
    `
  }

  @property({ type: Object })
  public selected?: GraphPointer

  @property({ type: String })
  public inputValue = ''

  @property({ type: Boolean })
  public empty = true

  @property({ type: Boolean })
  public hoist = true

  @property({ type: Boolean })
  public readonly = false

  @property({ type: Number, attribute: 'debounce-timeout' })
  public debounceTimeout = 350

  @property({ type: Boolean, reflect: true })
  public loading?: boolean

  @query('sl-input')
  private _input!: SlInput

  @query('sl-dropdown')
  private _menu!: SlDropdown

  render() {
    return html`<sl-dropdown @sl-hide=${stop} @sl-show="${stop}" ?hoist="${this.hoist}" .disabled="${this.readonly}">
      <sl-input slot="trigger"
                .value=${this.inputValue}
                @keydown="${this._inputKeyDown}"
                @sl-input="${debounce(this.dispatchSearch, this.debounceTimeout)}">
        <sl-icon name="${this.loading ? 'arrow-repeat' : 'search'}" slot="suffix"></sl-icon>
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

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('loading')) {
      if (this.loading) {
        this._menu.hide()
      } else {
        this._menu.show()
      }
    }
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

  _inputKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.stopPropagation()
    }
  }
}
