import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import { repeat } from 'lit/directives/repeat.js'

@customElement('sh-sl-with-lang-editor')
export class ShSlWithLangEditor extends LitElement {
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

  @property({ type: Array })
    languages?: string[]

  @property({ type: String })
    language?: string

  protected render() {
    return html`
      <slot></slot>
      ${this.renderLanguageSelector()}
    `
  }

  private renderLanguageSelector() {
    const language = this.language || ''

    if (this.languages?.length) {
      return html`
        <sl-select label="Language" placeholder="None" class="selector" @sl-change="${this.dispatchSelected}" .value="${language}">
          ${repeat(this.languages, lang => html`<sl-menu-item value="${lang}">${lang}</sl-menu-item>`)}
        </sl-select>`
    }

    return html`<sl-input class="selector" 
                          label="Language"
                          @sl-change="${this.dispatchSelected}"
                          placeholder="None"
                          .value="${language}"></sl-input>`
  }

  private dispatchSelected(e: any) {
    this.dispatchEvent(new CustomEvent('language-selected', {
      detail: {
        value: e.target.value,
      },
    }))
  }
}
