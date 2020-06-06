import { EditorFactory } from '@hydrofoil/shaperone-wc/components'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import { dash } from '@hydrofoil/shaperone-core'

export const textArea: EditorFactory = {
  term: dash.TextAreaEditor,

  render({ value, update }) {
    return html`
      <mwc-textarea
        .value="${value.object.value}"
        required
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></mwc-textarea>
    `
  },

  loadDependencies() {
    return [import('@material/mwc-textarea/mwc-textarea')]
  },
}
