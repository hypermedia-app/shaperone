import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'
import {
  BooleanSelectEditor,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import type { GraphPointer } from 'clownface'
import { FormSettings, PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { literal } from '@rdf-esm/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { validity } from '../directives/validity'

function select(
  form: FormSettings,
  value: PropertyObjectState,
  pointers: [GraphPointer, string][] | undefined,
  actions: Pick<SingleEditorActions, 'update'>,
) {
  const choices = pointers?.map(([c, label]) => ({
    term: c.term,
    label,
  })) || []

  return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}" ${validity(value)}>
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.term.equals(value.object?.term)}" value="${choice.term.value}">
        ${choice.label}
    </mwc-list-item>`)}
</mwc-select>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ form, value }, actions) {
  return select(form, value, value.componentState.choices, actions)
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ form, value }, actions) {
  return select(form, value, value.componentState.instances, actions)
}

export const booleanSelect: Render<BooleanSelectEditor> = function ({ value }, { update, clear }) {
  function onSelected(e: any) {
    if (e.target.selected?.value) {
      update(literal(e.target.selected.value, xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<mwc-select @selected="${onSelected}" .value="${value.object?.value || ''}" ${validity(value)}>
    <mwc-list-item></mwc-list-item>
    <mwc-list-item value="true">true</mwc-list-item>
    <mwc-list-item value="false">false</mwc-list-item>
  </mwc-select>`
}
