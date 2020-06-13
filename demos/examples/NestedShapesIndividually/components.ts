import { sh } from '@tpluscode/rdf-ns-builders'
import { html } from '@hydrofoil/shaperone-wc'
import type { EditorFactoryParams, EditorFactoryActions } from '@hydrofoil/shaperone-wc/components'

export const shapeLink = {
  term: sh.Shape,

  render({ value }: EditorFactoryParams, { pushFocusNode }: EditorFactoryActions) {
    return html`<a href="javascript:void(0)" @click="${pushFocusNode}">Edit ${value.object.value}</a>`
  },
}
