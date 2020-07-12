import type { Component } from '@hydrofoil/shaperone-wc'
import { dash, sh, rdfs } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'

export const enumSelect: Component = {
  editor: dash.EnumSelectEditor,
  render({ value, property }, { update }) {
    const choices = [...property.shape._selfGraph.out(sh.in).list()].map(choice => ({
      term: choice.term,
      label: choice.out(rdfs.label).value || choice.value,
    }))

    return html`<vaadin-select .value="${value.object.value}" @value-changed="${(e: CustomEvent) => {
      const pointer = choices.find(choice => choice.term.value === e.detail.value)
      if (pointer) update(pointer.term)
    }}">
        <template>
            <vaadin-list-box>
                ${repeat(choices, choice => html`<vaadin-item ?selected="${choice.term.value === value.object.value}">${choice.label}</vaadin-item>`)}
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
