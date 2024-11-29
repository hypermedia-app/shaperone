import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type {
  BooleanSelectEditor,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components.js'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type { Render } from '../index.js'
import { getType } from './lib/textFieldType.js'
import { validity } from './validity.js'
import { readOnly } from './readonly.js'
import { spread } from '../lib/spread.js'

export const textField: Render = function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                     ${spread(getType(property.datatype))}
                     ${validity(value)}
                     ${readOnly(property)}
                     @blur="${(e: any) => update(e.target.value)}">`
}

export const textArea: Render = function ({ env, property, value }, { update }) {
  return html`<textarea ${readOnly(property)} @blur="${(e: any) => update(env.literal(e.target.value))}" ${validity(value)}>${value.object?.value}</textarea>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ property, value, componentState }, { update }) {
  const choices = componentState.choices || []

  function updateHandler(e: any) {
    const chosen = choices[(e.target).selectedIndex - 1]
    if (chosen) update(chosen.term)
  }

  return html`<select ${readOnly(property)} @input="${updateHandler}" required ${validity(value)}>
        <option value=""></option>
        ${repeat(choices, pointer => html`<option ?selected="${pointer.value === value.object?.value}" value="${pointer.value}">
            ${localizedLabel(pointer, { fallback: pointer.value })}
        </option>`)}
    </select>`
}

export const datePicker = (type: 'date' | 'datetime-local'): Render => function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="${type}"
                       ${validity(value)}
                       ${readOnly(property)}
                       @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ property, value, componentState }, { update, clear }) {
  const choices = componentState.instances || []

  function onInput(e: any) {
    const { selectedIndex } = e.target
    return selectedIndex === 0
      ? clear()
      : update(choices[(e.target).selectedIndex - 1]?.term)
  }

  return html`<select ${readOnly(property)} @input="${onInput}" ${validity(value)}>
        <option value=""></option>
        ${repeat(choices, pointer => html`<option ?selected="${pointer.term.equals(value.object?.term)}" value="${pointer.value}">
            ${localizedLabel(pointer)}
        </option>`)}
    </select>`
}

export const uri: Render = function ({ env, property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="url"
                       ${validity(value)}
                       ${readOnly(property)}
                       @blur="${(e: any) => update(env.namedNode(e.target.value))}">`
}

export const booleanSelect: Render<BooleanSelectEditor> = function ({ env, value, property }, { clear, update }) {
  function changed(e: any) {
    if (e.target.value) {
      update(env.literal(e.target.value, xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<select ${readOnly(property)} @change="${changed}" ${validity(value)}>
      <option></option>
      <option value="true" ?selected="${value.object?.value === 'true'}">true</option>
      <option value="false" ?selected="${value.object?.value === 'false'}">false</option>
    </select>`
}
