import { EditorFactory } from '@hydrofoil/shaperone-wc/components'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import { dash } from '@hydrofoil/shaperone-core'

export const textField: EditorFactory = {
  term: dash.TextFieldEditor,

  render({ value }, { update }) {
    return html`
      <mwc-textfield
        .value="${value.object.value}"
        required
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></mwc-textfield>
    `
  },

  loadDependencies() {
    return [import('@material/mwc-textfield/mwc-textfield')]
  },
}
