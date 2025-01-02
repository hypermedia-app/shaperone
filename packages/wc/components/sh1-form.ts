import { html } from 'lit'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Form extends ShaperoneElementBase {
  render() {
    return html`
      <slot></slot>`
  }
}
