import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import { html } from 'lit'
import sh1Button from '@hydrofoil/shaperone-wc/components/sh1-button.js'

export default class Button extends sh1Button {
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
