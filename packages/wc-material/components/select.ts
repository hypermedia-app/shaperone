import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'
import {
  EnumSelectEditor,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { Term } from 'rdf-js'
import type { GraphPointer } from 'clownface'
import { FormSettings } from '@hydrofoil/shaperone-core/models/forms'

function select(this: EnumSelectEditor | InstancesSelectEditor,
  form: FormSettings, value: Term | undefined,
  pointers: [GraphPointer, string][] | undefined,
  actions: Pick<SingleEditorActions, 'update'>) {
  const choices = pointers?.map(([c, label]) => ({
    term: c.term,
    label,
  })) || []

  return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}">
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.term.equals(value)}" value="${choice.term.value}">
        ${choice.label}
    </mwc-list-item>`)}
</mwc-select>`
}

export const enumSelect: Render<EnumSelectEditor> = function ({ form, value }, actions) {
  return select.call(this, form, value.object?.term, value.componentState.choices, actions)
}

export const instancesSelect: Render<InstancesSelectEditor> = function ({ form, value }, actions) {
  return select.call(this, form, value.object?.term, value.componentState.instances, actions)
}
