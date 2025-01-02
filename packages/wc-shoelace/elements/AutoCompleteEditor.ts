import type { PropertyValues } from 'lit'
import { css, html } from 'lit'
import { property, query } from 'lit/decorators.js'
import type { SlDropdown, SlInput } from '@shoelace-style/shoelace'
import type { AutoCompleteEditor } from '@hydrofoil/shaperone-core/components.js'
import AutoCompleteBase from '@hydrofoil/shaperone-wc/elements/AutoCompleteEditor.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { isNamedNode } from 'is-graph-pointer'
import { stop } from '../lib/handlers.js'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(AutoCompleteBase) implements AutoCompleteEditor {
  static editor = dash.AutoCompleteEditor

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

  @property({ type: String })
  public inputValue = ''

  @property({ type: Boolean })
  public hoist = true

  @property({ type: Boolean })
  public readonly = false

  @property({ type: Boolean })
  public clearable = false

  @property({ type: Boolean, reflect: true })
  public loading?: boolean

  @query('sl-input')
  private _input!: SlInput

  @query('sl-dropdown')
  private _menu!: SlDropdown

  private _hasFocus!: boolean

  render() {
    let nodeValue = ''
    if (isNamedNode(this.selected)) {
      const nodeUrl = new URL(this.selected.value)
      nodeValue = nodeUrl.hash || nodeUrl.pathname
    }
    const fallback = nodeValue || this.searchText

    return html`<sl-dropdown @sl-hide=${stop} @sl-show="${stop}" ?hoist="${this.hoist}" .disabled="${this.readonly}">
      <sl-input slot="trigger" autocomplete="off"
                .value=${localizedLabel(this.selected, { fallback })}
                @keydown="${this._inputKeyDown}"
                @sl-focus="${() => { this._hasFocus = true }}"
                @sl-blur="${() => { this._hasFocus = false }}"
                @sl-input="${this.onSearch}">
        <sl-icon-button id="clear"
                        name="x-circle-fill"
                        slot="suffix"
                        ?hidden="${!this.selected || !this.clearable}"
                        @click="${this.cleared}"></sl-icon-button>
        <sl-icon name="${this.loading ? 'arrow-repeat' : 'search'}" slot="suffix"></sl-icon>
      </sl-input>
      <sl-menu hoist .value=${this.selected?.value}
               ?hidden="${this.filteredChoices.length === 0}"
               placeholder="Missing data!"
               @sl-select=${this.onItemSelected}>
        ${this.filteredChoices.map(item => html`
      <sl-menu-item .value=${item.value}>${localizedLabel(item, { fallback: item.value })}</sl-menu-item>`)}
      </sl-menu>
    </sl-dropdown>
    `
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)

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
    this.clear()
  }

  async onSearch() {
    this.loading = true
    await this.search(this._input.value)
    this.loading = false
  }

  onItemSelected(e: CustomEvent) {
    this.selected = this.filteredChoices.find(({ value }) => value === e.detail.item.value)
    this.setValue(this.selected!.term)
  }

  _inputKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.stopPropagation()
    }
  }

  get dependencies() {
    return import('./AutoCompleteEditor.deps.js')
  }
}
