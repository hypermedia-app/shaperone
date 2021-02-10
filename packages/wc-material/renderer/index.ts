import { css, html } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import { FocusNodeTemplate, ObjectTemplate, PropertyTemplate } from '@hydrofoil/shaperone-wc/templates'
import { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'
import type { NodeShape } from '@rdfine/shacl'

export const focusNode = (currentStrategy: FocusNodeTemplate): FocusNodeTemplate => {
  const renderer: FocusNodeTemplate = function (renderer, params) {
    const { actions, context: { templates } } = renderer
    const { focusNode } = params

    const shapes = focusNode.shapes.length ? focusNode.shapes : renderer.context.shapes
    const shapesLabels = shapes.map<[NodeShape, string]>(shape => [shape, templates.meta.label.call(renderer, shape.pointer) || shape.pointer.value])

    return html`<mwc-list part="focus-node-header">
      <mwc-list-item ?hasmeta="${shapes.length > 1}" twoline>
          ${templates.meta.label.call(renderer, focusNode.focusNode) || 'Resource'}
          <span slot="secondary">${templates.meta.label.call(renderer, focusNode.shape?.pointer)}</span>
          <mwc-shape-selector slot="meta" .shapes="${shapesLabels}" title="Select shape"
                             .selected="${focusNode.shape}"
                             @shape-selected="${(e: CustomEvent) => actions.selectShape(e.detail.value)}"></mwc-shape-selector>
      </mwc-list-item>
  </mwc-list>

  ${currentStrategy(renderer, params)}`
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

export const property: PropertyTemplate = function (renderer, param) {
  const { actions, context: { templates } } = renderer
  const { property } = param

  const menuElement = property.editors.length
    ? html`<mwc-property-menu slot="meta"
                         .property="${property}" part="property-options"
                         @multi-editor-selected="${actions.selectMultiEditor}"
                         @single-editors-selected="${actions.selectSingleEditors}"></mwc-property-menu>`
    : html``

  const editors = () => {
    if (property.selectedEditor) {
      return html`<mwc-item-lite part="editor">${renderer.renderMultiEditor()}</mwc-item-lite>`
    }

    const addRow = !property.selectedEditor && property.canAdd
      ? html`<mwc-item-lite part="property-options">
              <i @click="${actions.addObject}">Click to add value</i>
              <mwc-icon slot="options" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>
          </mwc-item-lite>`
      : html``

    return html`
          ${repeat(property.objects, object => renderer.renderObject({ object }))}
          ${addRow}
        `
  }

  return html`<mwc-list part="property">
    <mwc-list-item hasmeta part="property-header"><b>${templates.meta.label.call(renderer, property.shape.pointer)}</b> ${menuElement}</mwc-list-item>
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

export const object: ObjectTemplate = function (renderer, param) {
  const { object } = param
  const { actions, property, context: { templates } } = renderer

  function onEditorSelected(e: CustomEvent) {
    actions.selectEditor(e.detail.editor)
  }

  let metaSlot = html``
  let hasOptions = false
  if (object.editors.length > 1 && !object.editorSwitchDisabled) {
    hasOptions = true
    const editors = object.editors.map<[SingleEditorMatch, string]>(editor => [editor, templates.editor.label.call(renderer, editor.term) || editor.term.value])
    metaSlot = html`<mwc-editor-toggle .editors="${editors}" slot="options"
                                       @editor-selected="${onEditorSelected}"
                                       .removeEnabled="${property.canRemove}"
                                       @object-removed="${actions.remove}"
                                       .selected="${object.selectedEditor}"
                                       part="editor-options"
                                       title="Select editor"></mwc-editor-toggle>`
  } else if (property.canRemove) {
    hasOptions = true
    metaSlot = html`<mwc-icon slot="options" part="editor-options" @click="${actions.remove}" title="Remove value">remove_circle</mwc-icon>`
  }

  return html`<mwc-item-lite part="editor" ?has-options="${hasOptions}">
    ${renderer.renderEditor()}
    ${metaSlot}
  </mwc-item-lite>`
}

object.loadDependencies = () => [
  import('../elements/mwc-item-lite'),
  import('../elements/mwc-editor-toggle'),
]
