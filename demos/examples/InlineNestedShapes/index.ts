import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import { isResource } from 'is-graph-pointer'

export const nestedForm: SingleEditorComponent = {
  editor: dash.DetailsEditor,

  render({ value, renderer, property: { shape: { node } } }) {
    const focusNode = value.object

    if (isResource(focusNode)) {
      return renderer.renderFocusNode({ focusNode, shape: node })
    }

    return html``
  },
}
