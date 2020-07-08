import type { Component } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { dash } from '@tpluscode/rdf-ns-builders'
import { getType } from './lib/textFieldType'

export const textField: Component = {
  editor: dash.TextFieldEditor,

  render({ value, property }, { update }) {
    return html`
      <mwc-textfield
        .value="${value.object.value}"
        type="${getType(property.datatype)}"
        required
        @blur="${(e: any) => update(e.target.value)}"
      ></mwc-textfield>
    `
  },

  loadDependencies() {
    return [import('@material/mwc-textfield/mwc-textfield')]
  },
}
