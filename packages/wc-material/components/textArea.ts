import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import '@material/mwc-textarea/mwc-textarea'

export const textArea: RenderSingleEditor =
  function render({ value }, { update }) {
    return html`
      <mwc-textarea
        .value="${value.object?.value || ''}"
        required
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></mwc-textarea>
    `
  }
