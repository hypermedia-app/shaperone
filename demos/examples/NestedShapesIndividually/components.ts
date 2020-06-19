import { dash } from '@tpluscode/rdf-ns-builders'
import { Component, html } from '@hydrofoil/shaperone-wc'

export const shapeLink: Component = {
  editor: dash.CompoundEditor,

  render({ value }, { pushFocusNode }) {
    return html`<a href="javascript:void(0)" @click="${pushFocusNode}">Edit ${value.object.value}</a>`
  },
}
