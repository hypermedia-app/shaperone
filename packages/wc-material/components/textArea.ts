import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit'
import '@material/mwc-textarea/mwc-textarea'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly.js'
import { validity } from '../directives/validity.js'

export const textArea: Render =
  function render({ env, property, value }, { update }) {
    return html`
      <mwc-textarea
        .value="${value.object?.value || ''}"
        required
        ${validity(value)}
        ${readOnly(property)}
        @blur="${(e: any) => update(env.literal(e.target.value))}"
      ></mwc-textarea>
    `
  }
