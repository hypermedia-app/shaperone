import type { LitElement, PropertyValues } from 'lit'
import { html, css } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { ComponentConstructor, SingleEditorComponent } from '@hydrofoil/shaperone-core/components.js'
import type { GraphPointer } from 'clownface'
import { isLiteral } from 'is-graph-pointer'
import env from '@hydrofoil/shaperone-core/env.js'

type LitElementConstructor = new (...args: any[]) => LitElement

export function FieldWithLangMixin<T extends ComponentConstructor<SingleEditorComponent> & LitElementConstructor>(Base: T): T {
  class FieldWithLang extends Base {
    static get styles() {
      return css`
        :host {
          display: flex;
          justify-content: space-between;
        }

        slot {
          display: block;
          flex: 1;
        }

        .selector {
          margin-left: var(--sl-spacing-x-small);
        }

        sl-input.selector::part(form-control-input) {
          width: 80px;
        }

        .selector::part(form-control) {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .selector::part(form-control-label) {
          flex: 0 0 auto;
          width: 60px;
          text-align: right;
        }
      `
    }

    get languages() {
      return this.property.shape.languageIn
    }

    @state()
    private language?: string

    @state()
    private literal?: string

    @property({ type: Boolean })
    public readonly = false

    constructor() {
      super()

      this.addEventListener('value-changed', this.literalChanged.bind(this))
    }

    protected render() {
      return html`
        <slot></slot>
        ${this.renderLanguageSelector()}
      `
    }

    updated(_changedProperties: PropertyValues) {
      super.updated(_changedProperties)

      if (_changedProperties.has('value') && this.value.object) {
        this.language = this.extractLanguage(this.value.object)
        this.literal = this.value.object.value
      }
    }

    private renderLanguageSelector() {
      const language = this.language || ''

      if (this.languages.length) {
        return html`
          <sl-select label="Language" placeholder="None" class="selector" @sl-change="${this.languageSelected}"
                     .value="${language}" .disabled="${this.readonly}">
            ${repeat(this.languages, lang => html`<sl-menu-item value="${lang}">${lang}</sl-menu-item>`)}
          </sl-select>`
      }

      return html`
        <sl-input class="selector"
                  label="Language"
                  @sl-change="${this.languageSelected}"
                  placeholder="None"
                  .readonly="${this.readonly}"
                  .value="${language}"></sl-input>`
    }

    private literalChanged(e: CustomEvent) {
      if (e.target === this) {
        return
      }

      this.literal = typeof e.detail.value === 'string' ? e.detail.value : e.detail.value.value
      e.stopPropagation()
      this.dispatchSelected()
    }

    private extractLanguage(ptr: GraphPointer) {
      return isLiteral(ptr) ? ptr.term.language : ''
    }

    private languageSelected(e: any) {
      this.language = e.target.value
      this.dispatchSelected()
    }

    private dispatchSelected() {
      if (this.literal && this.language) {
        this.setValue(env().literal(this.literal, this.language))
      }
    }

    * dependencies() {
      yield import('@shoelace-style/shoelace/dist/components/button/button.js')
      yield import('@shoelace-style/shoelace/dist/components/input/input.js')
      yield import('@shoelace-style/shoelace/dist/components/select/select.js')
      yield import('@shoelace-style/shoelace/dist/components/menu-item/menu-item.js')
    }
  }

  return FieldWithLang
}
