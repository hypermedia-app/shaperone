import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import '@vaadin/vaadin-select/vaadin-select'
import '@vaadin/vaadin-list-box/vaadin-list-box'
import '@vaadin/vaadin-item/vaadin-item'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'

export const enumSelect: RenderSingleEditor<EnumSelect> = function (this: EnumSelectEditor, { value, property }, { update, updateComponentState }) {
  if (!value.componentState.choices) {
    this.loadChoices(property.shape, updateComponentState)
  }

  const choices = value.componentState.choices?.map(choice => ({
    term: choice.term,
    label: this.label(choice),
  })) || []

  const selectValue = choices.find(choice => choice.term.equals(value.object?.term))?.label

  return html`<vaadin-select .value="${selectValue}" @change="${(e: any) => {
    const pointer = choices.find(choice => choice.label === e.target.value)
    if (pointer) update(pointer.term)
  }}">
      <template>
          <vaadin-list-box>
              ${repeat(choices, choice => html`<vaadin-item ?selected="${choice.term.equals(value.object?.term)}">${choice.label}</vaadin-item>`)}
          </vaadin-list-box>
      </template>
</vaadin-select>`
}
