import { LitElement } from 'lit'
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js'
import type { CustomEventTarget } from './events.js'
import type { ShaperoneForm } from '../ShaperoneForm.js'

const registry: unique symbol = Symbol('custom elements registry')

export default abstract class ShaperoneElementBase extends ScopedElementsMixin(LitElement) implements CustomEventTarget {
  private [registry]: CustomElementRegistry | undefined

  protected form: ShaperoneForm | undefined

  protected get dispatch() {
    return this.form!.dispatch
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get registry() {
    return this[registry]
  }

  set registry(value: CustomElementRegistry | undefined) {
    this[registry] = value
  }

  connectedCallback() {
    this.form = findParentForm(this)

    super.connectedCallback()
  }
}

function findParentForm(host: Node) {
  function findInParentOrGrandParent(host: Node) {
    const rootNode = host.getRootNode()
    if (rootNode instanceof ShadowRoot) {
      const parent = rootNode.host

      if (parent.tagName === 'SHAPERONE-FORM') {
        return parent as ShaperoneForm
      }

      return findInParentOrGrandParent(parent)
    }

    return undefined
  }

  return findInParentOrGrandParent(host)
}
