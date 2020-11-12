import { dash } from '@tpluscode/rdf-ns-builders'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'

export const shapeLink: SingleEditorComponent = {
  editor: dash.DetailsEditor,

  render({ value }, { focusOnObjectNode }) {
    return html`<a href="javascript:void(0)" @click="${focusOnObjectNode}">Edit ${value.object?.value}</a>`
  },
}
