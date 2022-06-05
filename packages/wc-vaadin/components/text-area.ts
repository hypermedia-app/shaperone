import { html, Render } from '@hydrofoil/shaperone-wc'
import { literal } from '@rdf-esm/data-model'
import '@vaadin/text-area/vaadin-text-area'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
import { validity } from './validation'

export const textArea: Render = function ({ value, property }, { update }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(literal(e.target.value))}"
        ${spread(validity(value))}
        .readonly="${!!property.shape.readOnly}"
      ></vaadin-text-area>
    `
}
