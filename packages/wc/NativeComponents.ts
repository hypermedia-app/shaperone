import { html } from 'lit-element'
import { dash } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import type { Component } from './index'
import { getType } from './components/lib/textFieldType'

export const textFieldEditor: Component = {
  editor: dash.TextFieldEditor,

  render({ value, property }, { update }) {
    return html`<input .value="${value.object}"
                       type="${getType(property.datatype)}"
                       @blur="${(e: any) => update(e.target.value)}">`
  },
}

export const textAreaEditor: Component = {
  editor: dash.TextAreaEditor,

  render({ value }, { update }) {
    return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
  },
}
