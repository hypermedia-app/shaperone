import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit'
import $rdf from 'rdf-ext'
import '@material/mwc-textarea/mwc-textarea'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly'
import { validity } from '../directives/validity'

export const textArea: Render =
  function render({ property, value }, { update }) {
    return html`
      <mwc-textarea
        .value="${value.object?.value || ''}"
        required
        ${validity(value)}
        ${readOnly(property)}
        @blur="${(e: any) => update($rdf.literal(e.target.value))}"
      ></mwc-textarea>
    `
  }
