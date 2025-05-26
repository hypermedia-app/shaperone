import { css, html } from 'lit'
import { property } from 'lit/decorators.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

type ButtonKind = 'add-object' | 'remove-object'

export default class extends ShaperoneElementBase {
  static get styles() {
    return css`
      button {
        background: none;
        border: 1px solid transparent;
        border-radius: 1px;
        padding: 2px 4px;
      }

      button:hover {
        border-color: black;
      }`
  }

  @property({ type: String })
  public kind: ButtonKind | undefined

  constructor() {
    super()

    this.addEventListener('click', () => {
      if (this.kind) {
        this.dispatchEvent(new CustomEvent(this.kind, {
          bubbles: true,
          composed: true,
        }))
      }
    })
  }

  render() {
    return html`<button>
      <slot></slot>
    </button>`
  }
}
