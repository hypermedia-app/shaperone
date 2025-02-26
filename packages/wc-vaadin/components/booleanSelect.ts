import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import type { BooleanSelectEditor } from '@hydrofoil/shaperone-core/lib/components/booleanSelect.js'
import '@vaadin/vaadin-select'
import { spread } from '@open-wc/lit-helpers'
import { render } from 'lit'
import { guard } from 'lit/directives/guard.js'
import { validity } from './validation.js'

export const booleanSelect: Render<BooleanSelectEditor> = ({ env, value, property }, { update, clear }) => {
  function onChange(e: any) {
    if (e.target.value) {
      update(env.literal(e.target.value, env.ns.xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<vaadin-select
    .value="${value.object?.value || ''}"
    @change="${onChange}"
    ${spread(validity(value))}
    .readonly="${!!property.shape.readOnly}"
    .renderer="${guard([], () => (root: HTMLElement) => render(html`
      <vaadin-list-box>
        <vaadin-item></vaadin-item>
        <vaadin-item>true</vaadin-item>
        <vaadin-item>false</vaadin-item>
      </vaadin-list-box>`, root))}">
  </vaadin-select>`
}
