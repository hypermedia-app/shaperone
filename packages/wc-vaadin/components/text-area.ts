import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import '@vaadin/vaadin-text-field/vaadin-text-area'
import { spread } from '@open-wc/lit-helpers'
import { validity } from './validation'

export const textArea: Render = function ({ value }, { update }) {
  return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(literal(e.target.value))}"
        ...="${spread(validity(value))}"
      ></vaadin-text-area>
    `
}
