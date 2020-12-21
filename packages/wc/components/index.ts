import { html } from 'lit-element'
import { literal, namedNode } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import type {
  EnumSelect,
  EnumSelectEditor,
  InstancesSelect,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { RenderSingleEditor } from '../index'
import { getType } from './lib/textFieldType'

export const textField: RenderSingleEditor = function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                     type="${getType(property.datatype)}"
                     @blur="${(e: any) => update(e.target.value)}">`
}

export const textArea: RenderSingleEditor = function ({ value }, { update }) {
  return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object?.value}</textarea>`
}

export const enumSelect: RenderSingleEditor<EnumSelect> = function (this: EnumSelectEditor, { form, focusNode, value, property }, { update, updateComponentState }) {
  const choices = value.componentState.choices || []

  function updateHandler(e: any) {
    const chosen = choices[(e.target).selectedIndex - 1]
    if (chosen) update(chosen[0].term)
  }

  return html`<select @input="${updateHandler}" required>
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.value === value.object?.value}" value="${choice}">
            ${label}
        </option>`)}
    </select>`
}

export const datePicker = (type: string): RenderSingleEditor => function ({ value }, { update }) {
  return html`<input .value="${value.object}"
                       type="${type}"
                       @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: RenderSingleEditor<InstancesSelect> = function (this: InstancesSelectEditor, { form, focusNode, property, value }, { update, updateComponentState }) {
  const choices = value.componentState.instances || []

  return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1][0].term)}" required>
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.term.equals(value.object?.term)}" value="${choice}">
            ${label}
        </option>`)}
    </select>`
}

export const uri: RenderSingleEditor = function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="url"
                       @blur="${(e: any) => update(namedNode(e.target.value))}">`
}
