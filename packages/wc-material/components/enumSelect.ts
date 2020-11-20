import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'

export const enumSelect: RenderSingleEditor<EnumSelect> = function (this: EnumSelectEditor, { value, property }, actions) {
  if (!value.componentState.choices) {
    this.loadChoices(property.shape, actions.updateComponentState)
  }

  const choices = value.componentState.choices || []

  return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}">
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.value === value.object?.value}" value="${choice}">
        ${this.label(choice)}
    </mwc-list-item>`)}
</mwc-select>`
}
