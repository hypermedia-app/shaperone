import type { Component } from '@hydrofoil/shaperone-wc'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'

export const enumSelect: Component = {
  editor: dash.EnumSelectEditor,
  render({ value, property }, actions) {
    const choices = [...property.shape._selfGraph.out(sh.in).list()]

    return html`<vaadin-select .value="${value.object.value}" @value-changed="${(e: CustomEvent) => actions.update(e.detail.value)}">
        <template>
            <vaadin-list-box>
                ${repeat(choices, choice => html`<vaadin-item ?selected="${choice.value === value.object.value}">${choice}</vaadin-item>`)}
            </vaadin-list-box>
        </template>
</vaadin-select>`
  },
  loadDependencies() {
    return [
      import('@vaadin/vaadin-select/vaadin-select'),
      import('@vaadin/vaadin-list-box/vaadin-list-box'),
      import('@vaadin/vaadin-item/vaadin-item'),
    ]
  },
}
