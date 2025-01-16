import { html } from 'lit'
import sh1Button from '@hydrofoil/shaperone-wc/components/sh1-button.js'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class Button extends ShoelaceLoader(sh1Button) {
  render() {
    let name = 'plus-square'
    if (this.kind === 'remove-object') {
      name = 'x-square'
    }

    return html`<sl-icon-button style="font-size: 1.75em"
                                name="${name}"
                                label="${this.label}"
    ></sl-icon-button>`
  }

  get label() {
    return this.kind === 'remove-object' ? 'Remove value' : 'Add value'
  }

  get dependencies() {
    return {
      'sl-icon-button': import('@shoelace-style/shoelace/dist/components/icon-button/icon-button.component.js'),
    }
  }
}
