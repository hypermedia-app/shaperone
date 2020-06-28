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

export const property: PropertyRenderStrategy = ({ property, actions, renderObject }) => {
  let addIcon = html``

  if (!property.maxReached) {
    addIcon = html`<mwc-icon slot="meta" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>`
  }

  return html`<mwc-list title="Select editor">
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
  import('../elements/mwc-editor-toggle'),
]
