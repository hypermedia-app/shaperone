import { dash, rdfs, schema } from '@tpluscode/rdf-ns-builders'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { GraphPointer } from 'clownface'

function label(object?: GraphPointer) {
  return object?.out([rdfs.label, schema.name]).toArray()[0] || object?.value || ''
}

export const shapeLink: SingleEditorComponent = {
  editor: dash.DetailsEditor,

  render({ value }, { focusOnObjectNode }) {
    return html`<button @click="${focusOnObjectNode}">Edit ${label(value.object)}</button>`
  },
}
