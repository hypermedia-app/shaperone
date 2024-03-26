import type { Render } from '@hydrofoil/shaperone-wc'
import { html, render } from 'lit'
import '@vaadin/vaadin-select/vaadin-select'
import '@vaadin/vaadin-list-box/vaadin-list-box'
import '@vaadin/vaadin-item/vaadin-item'
import { EnumSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import type { Term } from '@rdfjs/types'
import { repeat } from 'lit/directives/repeat.js'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import type { GraphPointer } from 'clownface'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { validity } from './validation.js'

function renderer(choices: GraphPointer[], value: Term | undefined) {
  return function (root: HTMLElement) {
    let listBox = root.firstElementChild as HTMLElement
    if (!listBox) {
      root.appendChild(document.createElement('vaadin-list-box'))
      listBox = root.firstElementChild as HTMLElement
    }

    render(
      html`
        ${repeat(choices, pointer => html`<vaadin-item ?selected="${pointer.term.equals(value)}">
          ${localizedLabel(pointer, { fallback: pointer.value })}
        </vaadin-item>`)}
      `,
      listBox!,
    )
  }
}

export const enumSelect: Render<EnumSelectEditor> = function ({ value, componentState, property }, actions) {
  const choices = componentState.choices || []

  const selectValue = choices.find(choice => choice.term.equals(value.object?.term))?.value

  function onChange(e: any) {
    const pointer = choices.find(choice => choice.value === e.target.value)
    if (pointer) actions.update(pointer.term)
  }

  return html`<vaadin-select ${spread(validity(value))}
                             .readonly="${!!property.shape.readOnly}"
                             .renderer="${renderer(choices, value.object?.term)}"
                             .value="${selectValue || ''}"
                             @change="${onChange}"></vaadin-select>`
}
