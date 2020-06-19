import type { Component } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import { dash } from '@tpluscode/rdf-ns-builders'

export const textField: Component = {
  editor: dash.TextFieldEditor,

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
