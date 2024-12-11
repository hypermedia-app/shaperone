import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type {
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { validity } from './validity.js'
import { readOnly } from './readonly.js'

export const datePicker = (type: 'date' | 'datetime-local'): Render => function ({ property, value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                     type="${type}"
                     ${validity(value)}
                     ${readOnly(property)}
                     @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ property, value, componentState }, {
  update,
  clear,
}) {
  const choices = componentState.instances || []

  function onInput(e: any) {
    const { selectedIndex } = e.target
    return selectedIndex === 0
      ? clear()
      : update(choices[(e.target).selectedIndex - 1]?.term)
  }

  return html`<select ${readOnly(property)} @input="${onInput}" ${validity(value)}>
    <option value=""></option>
    ${repeat(choices, pointer => html`
      <option ?selected="${pointer.term.equals(value.object?.term)}" value="${pointer.value}">
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
