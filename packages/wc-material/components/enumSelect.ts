import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import '@material/mwc-select/mwc-select'
import '@material/mwc-list/mwc-list-item'

export const enumSelect: RenderSingleEditor = function ({ value, property }, actions) {
  const choices = property.shape.inPointers

  return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}">
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.value === value.object?.value}" value="${choice}">
        ${choice.out(rdfs.label).value || choice}
    </mwc-list-item>`)}
</mwc-select>`
}
