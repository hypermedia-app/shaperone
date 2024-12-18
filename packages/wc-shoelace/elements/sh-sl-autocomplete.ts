import type { PropertyValues } from 'lit'
import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import type { SlDropdown, SlInput } from '@shoelace-style/shoelace'
import debounce from 'p-debounce'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { AutoCompleteEditor } from '@hydrofoil/shaperone-core/components.js'
import { stop } from '../lib/handlers.js'

@customElement('sh-sl-autocomplete')
export default class extends SingleEditorComponent implements AutoCompleteEditor {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      sl-dropdown {
        width: 100%;
      }

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

  @property({ type: Boolean })
  public clearable = false

  @property({ type: Number, attribute: 'debounce-timeout' })
  public debounceTimeout = 350

  @property({ type: Boolean, reflect: true })
  public loading?: boolean

  @query('sl-input')
  private _input!: SlInput

  @query('sl-dropdown')
  private _menu!: SlDropdown

  private _hasFocus!: boolean

  render() {
    return html`<sl-dropdown @sl-hide=${stop} @sl-show="${stop}" ?hoist="${this.hoist}" .disabled="${this.readonly}">
      <sl-input slot="trigger"
                .value=${this.inputValue}
                @keydown="${this._inputKeyDown}"
                @sl-focus="${() => { this._hasFocus = true }}"
                @sl-blur="${() => { this._hasFocus = false }}"
                @sl-input="${debounce(this.dispatchSearch, this.debounceTimeout)}">
        <sl-icon-button id="clear"
                        name="x-circle-fill"
                        slot="suffix"
                        ?hidden="${!this.selected || !this.clearable}"
                        @click="${this.cleared}"></sl-icon-button>
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
      } else if (this._hasFocus) {
        this._menu.show()
      }
    }
  }

  cleared(e: Event) {
    e.stopPropagation()
    this.dispatchEvent(new Event('cleared'))
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
