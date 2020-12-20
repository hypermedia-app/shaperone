import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html, render } from 'lit-html'
import '@vaadin/vaadin-select/vaadin-select'
import '@vaadin/vaadin-list-box/vaadin-list-box'
import '@vaadin/vaadin-item/vaadin-item'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { Term } from 'rdf-js'
import { repeat } from 'lit-html/directives/repeat'

interface Choice {
  term: Term
  label: string
}

function renderer(choices: Choice[], value: Term | undefined) {
  return function (root: HTMLElement) {
    let listBox = root.firstElementChild
    if (!listBox) {
      root.appendChild(document.createElement('vaadin-list-box'))
      listBox = root.firstElementChild
    }

    render(
      html`
        ${repeat(choices, ({ label, term }) => html`<vaadin-item ?selected="${term.equals(value)}">${label}</vaadin-item>`)}
      `,
      listBox!,
    )
  }
}

export const enumSelect: RenderSingleEditor<EnumSelect> = function (this: EnumSelectEditor, { value }, actions) {
  const choices = value.componentState.choices?.map(([choice, label]) => ({
    term: choice.term,
    label,
  })) || []

  const selectValue = choices.find(choice => choice.term.equals(value.object?.term))?.label

  function onChange(e: any) {
    const pointer = choices.find(choice => choice.label === e.target.value)
    if (pointer) actions.update(pointer.term)
  }

  return html`<vaadin-select .renderer="${renderer(choices, value.object?.term)}" .value="${selectValue}" @change="${onChange}"></vaadin-select>`
}
