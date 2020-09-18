import { html } from 'lit-element'
import { dash, sh, rdfs } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import type { SingleEditorComponent } from './index'
import { getType } from './components/lib/textFieldType'

export const textFieldEditor: SingleEditorComponent = {
  editor: dash.TextFieldEditor,

  render({ value, property }, { update }) {
    return html`<input .value="${value.object}"
                       type="${getType(property.datatype)}"
                       @blur="${(e: any) => update(e.target.value)}">`
  },
}

export const textAreaEditor: SingleEditorComponent = {
  editor: dash.TextAreaEditor,

  render({ value }, { update }) {
    return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object}</textarea>`
  },
}

export const enumSelectEditor: SingleEditorComponent = {
  editor: dash.EnumSelectEditor,

  render({ value, property }, { update }) {
    const choices = [...(property.shape.pointer.out(sh.in).list() || [])]

    return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1].term)}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.value === value.object.value}" value="${choice}">
            ${choice.out(rdfs.label).value || choice}
        </option>`)}
    </select>`
  },
}

export const datePickerEditor: SingleEditorComponent = {
  editor: dash.DatePickerEditor,

  render({ value }, { update }) {
    return html`<input .value="${value.object}"
                       type="date"
                       @blur="${(e: any) => update(e.target.value)}">`
  },
}
