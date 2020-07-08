import { html } from 'lit-element'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
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

export const enumSelectEditor: Component = {
  editor: dash.EnumSelectEditor,

  render({ value, property }, { update }) {
    const choices = [...property.shape._selfGraph.out(sh.in).list()]

    return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1].value)}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.value === value.object.value}" value="${choice}">${choice}</option>`)}
    </select>`
  },
}
