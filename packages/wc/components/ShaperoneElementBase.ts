import { LitElement } from 'lit'
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js'

export default class extends ScopedElementsMixin(LitElement) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get registry() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let host = this

    while (host && host.localName !== 'shaperone-form') {
      ({ host } = (host.getRootNode() as any))
    }

    return host?.shadowRoot?.customElements
  }

  set registry(arg: CustomElementRegistry | undefined) {
  // ignored
  }
}
