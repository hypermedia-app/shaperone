import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'
import type {
  BooleanSelectEditor,
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components.js'
import type { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import type { GraphPointer } from 'clownface'
import type { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { readOnly } from '@hydrofoil/shaperone-wc/components/readonly.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { validity } from '../directives/validity.js'

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

export const booleanSelect: Render<BooleanSelectEditor> = function ({ env, value, property }, { update, clear }) {
  function onSelected(e: any) {
    if (e.target.selected?.value) {
      update(env.literal(e.target.selected.value, xsd.boolean))
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
