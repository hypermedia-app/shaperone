import { html } from 'lit-element'
import { dash, rdfs, rdf } from '@tpluscode/rdf-ns-builders'
import { literal, namedNode } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import { getInPointers } from '@hydrofoil/shaperone-core/lib/property'
import type{ GraphPointer } from 'clownface'
import type { SingleEditorComponent } from './index'
import { getType } from './components/lib/textFieldType'

export const textFieldEditor: SingleEditorComponent = {
  editor: dash.TextFieldEditor,

  render({ value, property }, { update }) {
    return html`<input .value="${value.object.value}"
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
    const choices = getInPointers(property.shape)

    return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1].term)}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.value === value.object.value}" value="${choice.value}">
            ${choice.out(rdfs.label).value || choice}
        </option>`)}
    </select>`
  },
}

export const datePickerEditor: SingleEditorComponent = {
  editor: dash.DatePickerEditor,

  render({ value }, { update }) {
    return html`<input .value="${value.object.value}"
                       type="date"
                       @blur="${(e: any) => update(e.target.value)}">`
  },
}

export const instancesSelectEditor: SingleEditorComponent = {
  editor: dash.InstancesSelectEditor,
  render({ property, value }, { update }) {
    const choices: GraphPointer[] = property.shape.pointer.any()
      .has(rdf.type, property.shape.class?.id)
      .toArray()

    return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1].term)}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.term.equals(value.object.term)}" value="${choice}">
            ${choice.out(rdfs.label).value || choice.value}
        </option>`)}
    </select>`
  },
}

export const uriEditor: SingleEditorComponent = {
  editor: dash.URIEditor,
  render({ value }, { update }) {
    return html`<input .value="${value.object.value}"
                       type="url"
                       @blur="${(e: any) => update(namedNode(e.target.value))}">`
  },
}
