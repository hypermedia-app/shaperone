import type { LitElement, TemplateResult } from 'lit'
import { html, css } from 'lit'
import SlSkeleton from '@shoelace-style/shoelace/dist/components/skeleton/skeleton.component.js'
import {ScopedDependencyLoader} from "@hydrofoil/shaperone-wc";

type DependencyMap = Record<string, CustomElementConstructor | Promise<CustomElementConstructor | { default: CustomElementConstructor }>>

export interface ComponentWithDependencies {
  dependencies?: DependencyMap | Promise<DependencyMap> | Promise<{ default: DependencyMap }>
  renderWhenReady(): TemplateResult
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

    static get scopedElements() {
      return {
        'sl-skeleton': SlSkeleton,
      }
    }

    renderSkeleton() {
      return html`<sl-skeleton effect="sheen"></sl-skeleton>`
    }
  }

  return WithShoelace
}
