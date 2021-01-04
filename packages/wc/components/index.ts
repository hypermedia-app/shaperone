import { html } from 'lit-element'
import { literal, namedNode } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import type {
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { Render } from '../index'
import { getType } from './lib/textFieldType'

export const textField: Render = function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                     type="${getType(property.datatype)}"
                     @blur="${(e: any) => update(e.target.value)}">`
}

export const textArea: Render = function ({ value }, { update }) {
  return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}">${value.object?.value}</textarea>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ value }, { update }) {
  const choices = value.componentState.choices || []

  function updateHandler(e: any) {
    const chosen = choices[(e.target).selectedIndex - 1]
    if (chosen) update(chosen[0].term)
  }

  return html`<select @input="${updateHandler}" required>
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.value === value.object?.value}" value="${choice.value}">
            ${label}
        </option>`)}
    </select>`
}

export const datePicker = (type: 'date' | 'datetime-local'): Render => function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="${type}"
                       @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ value }, { update }) {
  const choices = value.componentState.instances || []

  return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1][0].term)}" required>
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.term.equals(value.object?.term)}" value="${choice.value}">
            ${label}
        </option>`)}
    </select>`
}

export const uri: Render = function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="url"
                       @blur="${(e: any) => update(namedNode(e.target.value))}">`
}
