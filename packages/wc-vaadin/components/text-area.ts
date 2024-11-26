import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import '@vaadin/vaadin-text-field/vaadin-text-area'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import { validity } from './validation.js'

export const textArea: Render = function ({ env, value, property }, { update }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(env.literal(e.target.value))}"
        ${spread(validity(value))}
        .readonly="${!!property.shape.readOnly}"
      ></vaadin-text-area>
    `
}
