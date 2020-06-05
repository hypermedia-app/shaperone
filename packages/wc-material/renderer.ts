import {css, html} from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import { PropertyRenderStrategy, ObjectRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'

import '@material/mwc-icon/mwc-icon'
import '@material/mwc-list/mwc-list'
import '@material/mwc-list/mwc-list-item'
import './components/mwc-editor-toggle'

export const property: PropertyRenderStrategy = (property, renderObject, { addObject }) => {
  let addIcon = html``

  if (!property.maxReached) {
    addIcon = html`<mwc-icon slot="meta" @click="${addObject}">add_circle</mwc-icon>`
  }

  return html`<mwc-list>
    <mwc-list-item hasmeta>${property.name} ${addIcon}</mwc-list-item>
    ${repeat(property.objects, renderObject)}
  </mwc-list>`
}

property.styles = css`
  mwc-list-item {
    --mdc-ripple-color: transparent;
    overflow: visible;
  }`

export const object: ObjectRenderStrategy = (object, renderEditor, { selectEditor, remove }) => {
  function onEditorSelected(e: CustomEvent) {
    selectEditor(e.detail.editor)
  }

  return html`<mwc-list-item hasmeta>
    ${renderEditor()}
    <mwc-editor-toggle slot="meta" .editors="${object.editors}"
                       @editor-selected="${onEditorSelected}"
                       @object-removed="${remove}"></mwc-editor-toggle>
  </mwc-list-item>`
}
