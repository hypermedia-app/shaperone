import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import '@material/mwc-textarea/mwc-textarea'
import { validity } from '../directives/validity'

export const textArea: Render =
  function render({ value }, { update }) {
    return html`
      <mwc-textarea
        .value="${value.object?.value || ''}"
        required
        part="${validity(value)}"
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></mwc-textarea>
    `
  }
