import { state } from 'lit/decorators.js'
import type { LitElement, TemplateResult } from 'lit'

export interface ComponentWithDependencies {
  dependencies?(): Generator<Promise<unknown>>
  renderWhenReady(): TemplateResult
  renderSkeleton?(): TemplateResult
}

type Constructor<T extends LitElement> = new (...args: unknown[]) => T

export function GlobalDependencyLoader<T extends LitElement>(Base: Constructor<T>): Constructor<T & ComponentWithDependencies> {
  class WithDependencies extends Base implements ComponentWithDependencies {
    @state()
    private ready = false

    attachShadow(init: ShadowRootInit) {
      const { dependencies } = this as ComponentWithDependencies
      const shadowRoot = super.attachShadow(init)

      Promise.resolve()
        .then(async () => {
          if (dependencies) {
            await Promise.all(dependencies.call(this))
          }

          this.ready = true
        })

      return shadowRoot
    }

    render() {
      const { renderSkeleton } = this as ComponentWithDependencies
      if (!this.ready && renderSkeleton) {
        return renderSkeleton.call(this)
      }

      return this.renderWhenReady()
    }

    renderWhenReady(): TemplateResult {
      throw new Error('Render method not implemented')
    }
  }

  return WithDependencies
}
