import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'
import {
  EnumSelect,
  EnumSelectEditor,
  InstancesSelect,
  InstancesSelectEditor,
} from '@hydrofoil/shaperone-core/components'
import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { Term } from 'rdf-js'
import type { GraphPointer } from 'clownface'

function select(this: EnumSelectEditor | InstancesSelectEditor, value: Term | undefined, pointers: GraphPointer[] | undefined, actions: SingleEditorActions) {
  const choices = pointers?.map(c => ({
    term: c.term,
    label: this.label(c),
  })) || []

  return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}">
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.term.equals(value)}" value="${choice.term.value}">
        ${choice.label}
    </mwc-list-item>`)}
</mwc-select>`
}

export const enumSelect: RenderSingleEditor<EnumSelect> = function (this: EnumSelectEditor, { value, property }, actions) {
  if (!value.componentState.choices) {
    this.loadChoices(property.shape, actions.updateComponentState)
  }

  return select.call(this, value.object?.term, value.componentState.choices, actions)
}

export const instancesSelect: RenderSingleEditor<InstancesSelect> = function (this: InstancesSelectEditor, { value, property }, actions) {
  if (!value.componentState.instances) {
    this.loadChoices(property.shape, actions.updateComponentState)
  }

  return select.call(this, value.object?.term, value.componentState.instances, actions)
}
