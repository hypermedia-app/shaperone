import type { BooleanSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { spread } from '@open-wc/lit-helpers'
import type { TemplateResult } from 'lit'
import { css, html, render } from 'lit'
import { guard } from 'lit/directives/guard.js'
import { GlobalDependencyLoader, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import env from '@hydrofoil/shaperone-core/env.js'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { validity } from './validation.js'

export default class extends GlobalDependencyLoader(SingleEditorComponent) implements BooleanSelectEditor {
  static editor = dash.BooleanSelectEditor

  static get styles() {
    return css`
      vaadin-select::part(label) {
        visibility: var(--editor-label-visibility)
      }
    `
  }

  * dependencies() {
    yield import('@vaadin/vaadin-select')
    yield import('@vaadin/vaadin-list-box')
    yield import('@vaadin/vaadin-item')
  }

  renderWhenReady(): TemplateResult {
    return html`
      <vaadin-select
        label="${localizedLabel(this.property.shape.pointer, { property: sh.name })}"
        .value="${this.value.object?.value || ''}"
        @change="${this.onChange}"
        ${spread(validity(this.value))}
        .readonly="${!!this.property.shape.readOnly}"
        .renderer="${guard([], () => (root: HTMLElement) => render(html`
          <vaadin-list-box>
            <vaadin-item></vaadin-item>
            <vaadin-item>true</vaadin-item>
            <vaadin-item>false</vaadin-item>
          </vaadin-list-box>`, root))}">
      </vaadin-select>`
  }

  onChange(e: any) {
    if (e.target.value) {
      this.setValue(env().literal(e.target.value, env().ns.xsd.boolean))
    } else {
      this.clear()
    }
  }
}
