import { css, html } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { PropertyRenderStrategy, ObjectRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'

export const property: PropertyRenderStrategy = ({ property, actions, renderObject }) => {
  let addIcon = html``

  if (!property.maxReached) {
    addIcon = html`<mwc-icon slot="meta" @click="${actions.addObject}">add_circle</mwc-icon>`
  }

  return html`<mwc-list>
    <mwc-list-item hasmeta>${property.name} ${addIcon}</mwc-list-item>
    ${repeat(property.objects, renderObject)}
  </mwc-list>`
}

property.loadDependencies = () => [
  import('@material/mwc-icon/mwc-icon'),
  import('@material/mwc-list/mwc-list'),
  import('@material/mwc-list/mwc-list-item'),
]

property.styles = css`
  mwc-list-item {
    --mdc-ripple-color: transparent;
    overflow: visible;
  }`

export const object: ObjectRenderStrategy = ({ object, actions, renderEditor }) => {
  function onEditorSelected(e: CustomEvent) {
    actions.selectEditor(e.detail.editor)
  }

  return html`<mwc-list-item hasmeta>
    ${renderEditor()}
    <mwc-editor-toggle slot="meta" .editors="${object.editors}"
                       @editor-selected="${onEditorSelected}"
                       @object-removed="${actions.remove}"></mwc-editor-toggle>
  </mwc-list-item>`
}

object.loadDependencies = () => [
  import('@material/mwc-list/mwc-list-item'),
  import('./elements/mwc-editor-toggle'),
]
