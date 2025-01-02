import { state } from 'lit/decorators.js'
import type { LitElement, TemplateResult } from 'lit'
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js'

type DependencyMap = Record<string, CustomElementConstructor | Promise<CustomElementConstructor | { default: CustomElementConstructor }>>

export interface ComponentWithDependencies {
  dependencies?: DependencyMap | Promise<DependencyMap> | Promise<{ default: DependencyMap }>
  renderWhenReady(): TemplateResult
}

type Constructor<T extends LitElement> = new (...args: unknown[]) => T

export function DependencyLoader<T extends LitElement>(Base: Constructor<T>): Constructor<T & ComponentWithDependencies> {
  class WithDependencies extends ScopedElementsMixin(Base) implements ComponentWithDependencies {
    @state()
    private ready = false

    attachShadow(init: ShadowRootInit) {
      const { dependencies } = this as ComponentWithDependencies
      const shadowRoot = super.attachShadow(init)

      Promise.resolve(dependencies)
        .then(async (resolved) => {
          if (resolved) {
            const dependencyMap = await (resolved && 'default' in resolved ? resolved.default : resolved)
            const toLoad = Object.entries(dependencyMap)
              .map(async ([name, dependency]) => {
                const ctor = await dependency
                if (!shadowRoot.customElements!.get(name)) {
                  shadowRoot.customElements!.define(name, 'default' in ctor ? ctor.default : ctor)
                }
              })

            await Promise.all(toLoad)
          }

          this.ready = true
        })

      return shadowRoot
    }

    render() {
      if (!this.ready) {
        return this.renderSkeleton()
      }

      return this.renderWhenReady()
    }

    renderSkeleton() {
      throw new Error('Render method not implemented')
    }

    renderWhenReady(): TemplateResult {
      throw new Error('Render method not implemented')
    }
  }

  return WithDependencies
}
