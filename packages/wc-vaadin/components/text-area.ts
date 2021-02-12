import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import '@vaadin/vaadin-text-field/vaadin-text-area'

export const textArea: Render = function ({ value, actions: { update } }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></vaadin-text-area>
    `
}
