import { html } from 'lit-element'
import { literal, namedNode } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import { rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import type { GraphPointer } from 'clownface'
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

export const enumSelect: RenderSingleEditor = function ({ value, property }, { update }) {
  const choices = property.shape.inPointers

  function updateHandler(e: any) {
    const chosen = choices[(e.target).selectedIndex - 1]
    if (chosen) update(chosen.term)
  }

  return html`<select @input="${updateHandler}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.value === value.object?.value}" value="${choice}">
            ${choice.out(rdfs.label).value || choice}
        </option>`)}
    </select>`
}

export const datePicker = (type: string): RenderSingleEditor => function ({ value }, { update }) {
  return html`<input .value="${value.object}"
                       type="${type}"
                       @blur="${(e: any) => update(e.target.value)}">`
}

export const instancesSelect: RenderSingleEditor = function ({ property, value }, { update }) {
  const choices: GraphPointer[] = property.shape.pointer.any()
    .has(rdf.type, property.shape.class?.id)
    .toArray()

  return html`<select @input="${(e: any) => update(choices[(e.target).selectedIndex - 1].term)}" required>
        <option value=""></option>
        ${repeat(choices, choice => html`<option ?selected="${choice.term.equals(value.object?.term)}" value="${choice}">
            ${choice.out(rdfs.label).value || choice.value}
        </option>`)}
    </select>`
}

export const uri: RenderSingleEditor = function ({ value }, { update }) {
  return html`<input .value="${value.object?.value || ''}"
                       type="url"
                       @blur="${(e: any) => update(namedNode(e.target.value))}">`
}
