import type { LitElementConstructor } from '@open-wc/scoped-elements/lit-element.js'
import type { CustomEventTarget } from './events.js'

export default function FindParentCustomElementRegistry<T extends LitElementConstructor>(Base: T): T {
  return class extends Base implements CustomEventTarget {
    attachShadow(init: ShadowRootInit) {
      const registry = findRegistry(this)

      return super.attachShadow({
        ...init,
        registry,
        customElements: registry,
      })
    }
  }
}

function findRegistry(host: Node) {
  function registryOfParentOrGrandParent(host: Node) {
    const rootNode = host.getRootNode()
    if (rootNode instanceof ShadowRoot) {
      const parent = rootNode.host
      const registry = parent.shadowRoot?.customElements
      if (registry) {
        return registry
      }

      return registryOfParentOrGrandParent(parent)
    }

    return undefined
  }

  return registryOfParentOrGrandParent(host)
}
