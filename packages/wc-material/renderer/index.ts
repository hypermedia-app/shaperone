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

    const shapes = focusNode.matchingShapes.length ? focusNode.matchingShapes : focusNode.shapes

    return html`<mwc-list>
      <mwc-list-item ?hasmeta="${shapes.length > 1}" twoline>
          ${focusNode.label}
          <span slot="secondary">${focusNode.shape?.label}</span>
          <mwc-shape-selector slot="meta" .shapes="${shapes}" title="Select shape"
                             .selected="${focusNode.shape}"
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
  const menuElement = property.editors.length ? html`<mwc-property-menu slot="meta"
                         .property="${property}"
                         @multi-editor-selected="${actions.selectMultiEditor}"
                         @single-editors-selected="${actions.selectSingleEditors}"></mwc-property-menu>` : html``

  const editors = () => {
    if (property.selectedEditor) {
      return html`<mwc-item-lite>${renderMultiEditor()}</mwc-item-lite>`
    }

    const addRow = !property.selectedEditor && property.canAdd ? html`<mwc-item-lite>
              <i @click="${actions.addObject}">Click to add value</i>
              <mwc-icon slot="options" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>
          </mwc-item-lite>` : html``

    return html`
          ${repeat(property.objects, renderObject)}
          ${addRow}
        `
  }

  return html`<mwc-list>
    <mwc-list-item hasmeta><b>${property.name}</b> ${menuElement}</mwc-list-item>
    ${editors()}
  </mwc-list>`
}

property.loadDependencies = () => [
  import('../elements/mwc-item-lite'),
  import('../elements/mwc-property-menu'),
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
                                       .selected="${object.selectedEditor}"
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
