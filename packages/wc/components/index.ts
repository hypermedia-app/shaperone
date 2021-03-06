import { html } from 'lit-element'
import { literal, namedNode } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import type {
  BooleanSelectEditor,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { Render } from '../index'
import { getType } from './lib/textFieldType'
import { validity } from './validity'

export const textField: Render = function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                     type="${getType(property.datatype)}"
                     part="${validity(value)}"
                     @blur="${(e: any) => update(e.target.value)}">`
}

export const textArea: Render = function ({ value }, { update }) {
  return html`<textarea @blur="${(e: any) => update(literal(e.target.value))}" part="${validity(value)}">${value.object?.value}</textarea>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ value }, { update }) {
  const choices = value.componentState.choices || []

  function updateHandler(e: any) {
    const chosen = choices[(e.target).selectedIndex - 1]
    if (chosen) update(chosen[0].term)
  }

  return html`<select @input="${updateHandler}" required part="${validity(value)}">
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.value === value.object?.value}" value="${choice.value}">
            ${label}
        </option>`)}
    </select>`
}

export const datePicker = (type: 'date' | 'datetime-local'): Render => function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="${type}"
                       part="${validity(value)}"
                       @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ value }, { update }) {
  const choices = value.componentState.instances || []

  return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1][0].term)}" required part="${validity(value)}">
        <option value=""></option>
        ${repeat(choices, ([choice, label]) => html`<option ?selected="${choice.term.equals(value.object?.term)}" value="${choice.value}">
            ${label}
        </option>`)}
    </select>`
}

export const uri: Render = function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="url"
                       part="${validity(value)}"
                       @blur="${(e: any) => update(namedNode(e.target.value))}">`
}

export const booleanSelect: Render<BooleanSelectEditor> = function ({ value, property }, { clear, update }) {
  function changed(e: any) {
    if (e.target.value) {
      update(literal(e.target.value, xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<select @change="${changed}" part="${validity(value)}">
      <option></option>
      <option value="true" ?selected="${value.object?.value === 'true'}">true</option>
      <option value="false" ?selected="${value.object?.value === 'false'}">false</option>
    </select>`
}
