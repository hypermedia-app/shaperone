import { css, html } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import {
  PropertyRenderStrategy,
  ObjectRenderStrategy,
  FocusNodeRenderStrategy,
} from '@hydrofoil/shaperone-wc/lib/renderer'

export const focusNode = (currentStrategy: FocusNodeRenderStrategy): FocusNodeRenderStrategy => {
  const renderer: FocusNodeRenderStrategy = (params) => {
    const { focusNode, actions } = params

    return html`<mwc-list>
      <mwc-list-item ?hasmeta="${focusNode.shapes.length > 1}" twoline>
          ${focusNode.focusNode.value}
          <span slot="secondary">${focusNode.shape?.label}</span>
          <mwc-shape-selector slot="meta" .shapes="${focusNode.shapes}" title="Select shape"
                             @shape-selected="${(e: CustomEvent) => actions.selectShape(e.detail.value)}"></mwc-shape-selector>
      </mwc-list-item>
  </mwc-list>

  ${currentStrategy(params)}`
  }

  renderer.loadDependencies = () => {
    const inheritedDependencies = currentStrategy.loadDependencies?.() || []

    return [
      import('../elements/mwc-shape-selector'),
      ...inheritedDependencies,
    ]
  }

  return renderer
}

export const property: PropertyRenderStrategy = ({ property, actions, renderObject, renderMultiEditor }) => {
  let addIcon = html``

  if (!property.multiEditor && property.canAdd) {
    addIcon = html`<mwc-icon slot="meta" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>`
  }

  return html`<mwc-list>
    <mwc-list-item hasmeta>${property.name} ${addIcon}</mwc-list-item>
    ${property.multiEditor ? html`<mwc-item-lite>${renderMultiEditor()}</mwc-item-lite>` : repeat(property.objects, renderObject)}
  </mwc-list>`
}

property.loadDependencies = () => [
  import('../elements/mwc-item-lite'),
  import('@material/mwc-icon/mwc-icon'),
  import('@material/mwc-list/mwc-list'),
  import('@material/mwc-list/mwc-list-item'),
]

property.styles = css`
  mwc-list-item {
    --mdc-ripple-color: transparent;
    overflow: visible;
  }`

export const object: ObjectRenderStrategy = ({ object, actions, renderEditor, property }) => {
  function onEditorSelected(e: CustomEvent) {
    actions.selectEditor(e.detail.editor)
  }

  let metaSlot = html``
  if (object.editors.length > 1) {
    metaSlot = html`<mwc-editor-toggle .editors="${object.editors}" slot="options"
                                       @editor-selected="${onEditorSelected}"
                                       .removeEnabled="${property.canRemove}"
                                       @object-removed="${actions.remove}"
                                       title="Select editor"></mwc-editor-toggle>`
  } else if (property.canRemove) {
    metaSlot = html`<mwc-icon slot="options" @click="${actions.remove}" title="Remove value">remove_circle</mwc-icon>`
  }

  return html`<mwc-item-lite>
    ${renderEditor()}
    ${metaSlot}
  </mwc-item-lite>`
}

object.loadDependencies = () => [
  import('../elements/mwc-item-lite'),
  import('../elements/mwc-editor-toggle'),
]
