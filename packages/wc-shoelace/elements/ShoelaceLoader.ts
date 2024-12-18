import { state } from 'lit/decorators.js'
import type { LitElement, TemplateResult } from 'lit'
import { css, html } from 'lit'

export interface ComponentWithDependencies {
  dependencies?(): Generator<Promise<unknown>>
  renderWhenReady(): TemplateResult
}

type Constructor<T extends LitElement> = new (...args: unknown[]) => T

export function ShoelaceLoader<T extends LitElement>(Base: Constructor<T>): Constructor<T & ComponentWithDependencies> {
  class WithShoelace extends Base implements ComponentWithDependencies {
    static get styles() {
      return css`
        sl-skeleton {
          width: 100px;
        }
      `
    }

    @state()
    private ready = false

    connectedCallback() {
      const { dependencies } = this as ComponentWithDependencies

      if (dependencies) {
        Promise.all(dependencies()).then(() => {
          this.ready = true
        })
      } else {
        this.ready = true
      }

      super.connectedCallback()
    }

    render() {
      if (!this.ready) {
        return html`<sl-skeleton effect="sheen"></sl-skeleton>`
      }

      return this.renderWhenReady()
    }

    renderWhenReady(): TemplateResult {
      throw new Error('Render method not implemented')
    }
  }

  return WithShoelace
}
