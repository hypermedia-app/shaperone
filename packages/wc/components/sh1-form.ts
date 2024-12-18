import { html, LitElement } from 'lit'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'

export class Sh1Form extends FindParentCustomElementRegistry(LitElement) {
  render() {
    return html`
      <slot></slot>`
  }
}
