import { SingleEditorComponent, html } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { GraphPointer } from 'clownface'
import { FocusNode } from '@hydrofoil/shaperone-core'

function isFocusNode(value?: GraphPointer): value is FocusNode {
  return value?.term.termType === 'NamedNode' || value?.term.termType === 'BlankNode'
}

export const nestedForm: SingleEditorComponent = {
  editor: dash.DetailsEditor,

  render({ value, renderer }) {
    const focusNode = value.object

    if (isFocusNode(focusNode)) {
      return renderer.renderFocusNode({ focusNode })
    }

    return html``
  },
}
