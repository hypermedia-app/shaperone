import { LitElement } from 'lit'
import type { CustomEventTarget } from './events.js'
import { DependencyLoader } from './DependencyLoader.js'

export default abstract class extends DependencyLoader(LitElement) implements CustomEventTarget {
  attachShadow(init: ShadowRootInit) {
    const registry = findRegistry(this)

    return super.attachShadow({
      ...init,
      registry,
      customElements: registry,
    })
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
