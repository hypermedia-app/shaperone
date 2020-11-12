import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import { dash } from '@tpluscode/rdf-ns-builders'

export const textArea: SingleEditorComponent = {
  editor: dash.TextAreaEditor,

  render({ value }, { update }) {
    return html`
      <mwc-textarea
        .value="${value.object?.value || ''}"
        required
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></mwc-textarea>
    `
  },

  loadDependencies() {
    return [import('@material/mwc-textarea/mwc-textarea')]
  },
}
