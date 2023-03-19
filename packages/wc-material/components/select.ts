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
import { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { literal } from '@rdfjs/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { validity } from '../directives/validity'

function select(
  form: FormSettings,
  value: PropertyObjectState,
  pointers: GraphPointer[],
  actions: Pick<SingleEditorActions, 'update'>,
  property: PropertyState,
) {
  return html`<mwc-select ${readOnly(property)} @selected="${(e: CustomEvent) => actions.update(pointers[e.detail.index].term)}" ${validity(value)}>
    ${repeat(pointers, pointer => html`<mwc-list-item ?selected="${pointer.term.equals(value.object?.term)}" value="${pointer.value}">
        ${localizedLabel(pointer, { fallback: pointer.value })}
    </mwc-list-item>`)}
</mwc-select>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ form, value, componentState, property }, actions) {
  return select(form, value, componentState.choices || [], actions, property)
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ form, value, componentState, property }, actions) {
  return select(form, value, componentState.instances || [], actions, property)
}

export const booleanSelect: Render<BooleanSelectEditor> = function ({ value, property }, { update, clear }) {
  function onSelected(e: any) {
    if (e.target.selected?.value) {
      update(literal(e.target.selected.value, xsd.boolean))
    } else {
      clear()
    }
  }

  return html`<mwc-select @selected="${onSelected}" .value="${value.object?.value || ''}" ${validity(value)} ${readOnly(property)}>
    <mwc-list-item></mwc-list-item>
    <mwc-list-item value="true">true</mwc-list-item>
    <mwc-list-item value="false">false</mwc-list-item>
  </mwc-select>`
}
