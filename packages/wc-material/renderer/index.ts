import { css, html } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import { FocusNodeTemplate, ObjectTemplate, PropertyTemplate } from '@hydrofoil/shaperone-wc/templates'
import { rdfs } from '@tpluscode/rdf-ns-builders'

export const focusNode = (currentStrategy: FocusNodeTemplate): FocusNodeTemplate => {
  const renderer: FocusNodeTemplate = function (params) {
    const { actions } = this
    const { focusNode } = params

    const shapes = focusNode.shapes.length ? focusNode.shapes : this.context.shapes

    return html`<mwc-list part="focus-node-header">
      <mwc-list-item ?hasmeta="${shapes.length > 1}" twoline>
          ${focusNode.focusNode.out(rdfs.label).value || 'Resource'}
          <span slot="secondary">${focusNode.shape?.label}</span>
          <mwc-shape-selector slot="meta" .shapes="${shapes}" title="Select shape"
                             .selected="${focusNode.shape}"
                             @shape-selected="${(e: CustomEvent) => actions.selectShape(e.detail.value)}"></mwc-shape-selector>
      </mwc-list-item>
  </mwc-list>

  ${currentStrategy.call(this, params)}`
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

export const property: PropertyTemplate = function (param) {
  const { actions } = this
  const { property } = param

  const menuElement = property.editors.length
    ? html`<mwc-property-menu slot="meta"
                         .property="${property}" part="property-options"
                         @multi-editor-selected="${actions.selectMultiEditor}"
                         @single-editors-selected="${actions.selectSingleEditors}"></mwc-property-menu>`
    : html``

  const editors = () => {
    if (property.selectedEditor) {
      return html`<mwc-item-lite part="editor">${this.renderMultiEditor()}</mwc-item-lite>`
    }

    const addRow = !property.selectedEditor && property.canAdd
      ? html`<mwc-item-lite part="property-options">
              <i @click="${actions.addObject}">Click to add value</i>
              <mwc-icon slot="options" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>
          </mwc-item-lite>`
      : html``

    return html`
          ${repeat(property.objects, object => this.renderObject({ object }))}
          ${addRow}
        `
  }

  return html`<mwc-list part="property">
    <mwc-list-item hasmeta part="property-header"><b>${property.name}</b> ${menuElement}</mwc-list-item>
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

export const object: ObjectTemplate = function (param) {
  const { object } = param
  const { actions, property } = this

  function onEditorSelected(e: CustomEvent) {
    actions.selectEditor(e.detail.editor)
  }

  let metaSlot = html``
  let hasOptions = false
  if (object.editors.length > 1 && !object.editorSwitchDisabled) {
    hasOptions = true
    metaSlot = html`<mwc-editor-toggle .editors="${object.editors}" slot="options"
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
    ${this.renderEditor()}
    ${metaSlot}
  </mwc-item-lite>`
}

object.loadDependencies = () => [
  import('../elements/mwc-item-lite'),
  import('../elements/mwc-editor-toggle'),
]
