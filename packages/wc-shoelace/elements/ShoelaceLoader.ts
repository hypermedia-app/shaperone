import type { LitElement, TemplateResult } from 'lit'
import { html, css } from 'lit'
import SlSkeleton from '@shoelace-style/shoelace/dist/components/skeleton/skeleton.component.js'
import { ScopedDependencyLoader } from '@hydrofoil/shaperone-wc'

type DependencyMap = Record<string, CustomElementConstructor | Promise<CustomElementConstructor | { default: CustomElementConstructor }>>

export interface ComponentWithDependencies {
  dependencies?: DependencyMap | Promise<DependencyMap> | Promise<{ default: DependencyMap }>
  renderWhenReady(): TemplateResult
  renderSkeleton(): TemplateResult
}

type Constructor<T extends LitElement> = new (...args: unknown[]) => T

export function ShoelaceLoader<T extends LitElement>(Base: Constructor<T>): Constructor<T & ComponentWithDependencies> {
  class WithShoelace extends ScopedDependencyLoader(Base) implements ComponentWithDependencies {
    static get styles() {
      return css`
        sl-skeleton {
          width: 100px;
        }
      `
    }

    attachShadow(init: ShadowRootInit) {
      const shadowRoot = super.attachShadow(init)
      if (!shadowRoot.customElements?.get('sl-skeleton')) {
        shadowRoot.customElements?.define('sl-skeleton', SlSkeleton)
      }
      return shadowRoot
    }

    renderSkeleton() {
      return html`<sl-skeleton effect="sheen"></sl-skeleton>`
    }
  }

  return WithShoelace as unknown as Constructor<T & ComponentWithDependencies>
}
