import { html, Render } from '@hydrofoil/shaperone-wc'
import { literal } from '@rdf-esm/data-model'
import '@vaadin/vaadin-text-field/vaadin-text-area'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import { validity } from './validation'

export const textArea: Render = function ({ value }, { update }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(literal(e.target.value))}"
        ${spread(validity(value))}
      ></vaadin-text-area>
    `
}
