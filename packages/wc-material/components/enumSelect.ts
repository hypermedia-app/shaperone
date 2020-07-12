import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash, sh, rdfs } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'

export const enumSelect: SingleEditorComponent = {
  editor: dash.EnumSelectEditor,
  render({ value, property }, actions) {
    const choices = [...property.shape._selfGraph.out(sh.in).list()]

    return html`<mwc-select @selected="${(e: CustomEvent) => actions.update(choices[e.detail.index].term)}">
    ${repeat(choices, choice => html`<mwc-list-item ?selected="${choice.value === value.object.value}" value="${choice}">
        ${choice.out(rdfs.label).value || choice}
    </mwc-list-item>`)}
</mwc-select>`
  },
  loadDependencies() {
    return [
      import('@material/mwc-select/mwc-select'),
      import('@material/mwc-list/mwc-list-item'),
    ]
  },
}
