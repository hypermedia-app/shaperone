import { html, Render } from '@hydrofoil/shaperone-wc'
import $rdf from 'rdf-ext'
import '@vaadin/vaadin-text-field/vaadin-text-area'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
import { validity } from './validation'

export const textArea: Render = function ({ value, property }, { update }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update($rdf.literal(e.target.value))}"
        ${spread(validity(value))}
        .readonly="${!!property.shape.readOnly}"
      ></vaadin-text-area>
    `
}
