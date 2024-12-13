import { css, html, LitElement } from 'lit'
import { property, query } from 'lit/decorators.js'
import type { PropertyElement } from '@hydrofoil/shaperone-wc/components/index.js'
import type { FocusNodeState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'

export class ShSlProperty extends LitElement implements PropertyElement {
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

  @property({ type: Object })
  public focusNode!: FocusNodeState

  @property({ type: Object })
  public property!: PropertyState

  @property({ type: Boolean })
  private __slotEmpty = true

  @query('slot')
  private __slot!: HTMLSlotElement

  render() {
    let helpText: any = ''
    if (this.property.shape.description) {
      helpText = html`<p id="help-text">${localizedLabel(this.property.shape, { property: sh.description })}</p>`
    }

    return html`
      <p id="label">${localizedLabel(this.property.shape, { property: sh.name })}</p>
      <slot class="${this.__slotEmpty ? 'empty' : ''}" @slotchange="${this.__hasAssignedElements}"></slot>
      ${helpText}
      <slot name="add-object"></slot>
    `
  }

  __hasAssignedElements() {
    this.__slotEmpty = this.__slot.assignedElements().length === 0
  }
}
