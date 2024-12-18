import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import { html, LitElement } from 'lit'

export default class Button extends LitElement {
  render() {
    let name = 'plus-square'
    if (this.slot === 'remove-object') {
      name = 'x-square'
    }

    return html`<sl-icon-button style="font-size: 1.75em"
                                name="${name}"
                                label="${this.label}"
    ></sl-icon-button>`
  }

  get label() {
    return this.slot === 'remove-object' ? 'Remove value' : 'Add value'
  }
}
