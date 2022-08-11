import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'

@customElement('sh-sl-property')
export class ShSlProperty extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        --sh-sl-label-font-size: var(--sl-font-size-medium);
        --sh-sl-help-text-font-size: var(--sl-font-size-small);
        --sh-sl-help-text-color: var(--sl-color-neutral-500);
      }

      slot::slotted(*) {
        padding: var(--sh-sl-property-object-padding, 0 0 10px);
      }

      #label {
        font-size: var(--sh-sl-label-font-size);
      }

      #help-text {
        margin-top: 0;
        font-size: var(--sh-sl-help-text-font-size);
        color: var(--sh-sl-help-text-color);
      }

      slot.empty + #help-text {
        margin-top: -1em;
      }
    `
  }

  @property({ type: Boolean })
  canAddValue?: boolean

  @property({ type: String })
  label?: string

  @property({ type: String })
  helpText?: string

  @property({ type: String })
  addIcon?: string

  @property({ type: Boolean })
  __slotEmpty = true

  @query('slot')
  __slot!: HTMLSlotElement

  render() {
    let addRow = html``
    if (this.canAddValue) {
      addRow = html`<sl-icon-button style="font-size: 1.75em"
                                  name="${this.addIcon || 'plus-square'}"
                                  label="Add value"
                                  @click="${() => this.dispatchEvent(new Event('added'))}"
    ></sl-icon-button>`
    }

    let helpText: any = ''
    if (this.helpText) {
      helpText = html`<p id="help-text">${this.helpText}</p>`
    }

    return html`
      <p id="label">${this.label}</p>
      <slot class="${this.__slotEmpty ? 'empty' : ''}" @slotchange="${this.__hasAssignedElements}"></slot>
      ${helpText}
      ${addRow}
    `
  }

  __hasAssignedElements() {
    this.__slotEmpty = this.__slot.assignedElements().length === 0
  }
}
