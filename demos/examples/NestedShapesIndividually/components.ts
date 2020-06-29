import { dash } from '@tpluscode/rdf-ns-builders'
import { Component, html } from '@hydrofoil/shaperone-wc'

export const shapeLink: Component = {
  editor: dash.DetailsEditor,

  render({ value }, { focusOnObjectNode }) {
    return html`<a href="javascript:void(0)" @click="${focusOnObjectNode}">Edit ${value.object.value}</a>`
  },
}
