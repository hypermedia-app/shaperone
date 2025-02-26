import { css, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { FocusNodeTemplate, ObjectTemplate, PropertyTemplate } from '@hydrofoil/shaperone-wc/templates.js'
import { decorate } from '@hydrofoil/shaperone-wc/templates.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

export const focusNode = decorate((currentStrategy: FocusNodeTemplate): FocusNodeTemplate => {
  const renderer: FocusNodeTemplate = (renderer, params) => {
    const { actions } = renderer
    const { focusNode } = params

    const shapes = focusNode.shapes.length ? focusNode.shapes : renderer.context.shapes

    return html`<mwc-list part="focus-node-header ${focusNode.hasErrors ? 'invalid' : ''}">
      <mwc-list-item ?hasmeta="${shapes.length > 1}" twoline>
          ${localizedLabel(focusNode.focusNode, { fallback: 'Resource' })}
          <span slot="secondary">${localizedLabel(focusNode.shape)}</span>
          <mwc-shape-selector slot="meta" .shapes="${shapes}" title="Select shape"
                             .selected="${focusNode.shape}"
                             @shape-selected="${(e: CustomEvent) => actions.selectShape(e.detail.value)}"></mwc-shape-selector>
      </mwc-list-item>
  </mwc-list>

  ${currentStrategy(renderer, params)}`
  }

  renderer.loadDependencies = () => [
    import('../elements/mwc-shape-selector.js'),
  ]

  return renderer
})

export const property: PropertyTemplate = function (renderer, param) {
  const { actions } = renderer
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
              <i @click="${actions.addObject}" @keyDown="${onEnter(actions.addObject)}">Click to add value</i>
              <mwc-icon slot="options" @click="${actions.addObject}" title="Add value">add_circle</mwc-icon>
          </mwc-item-lite>`
      : html``

    return html`
          ${repeat(property.objects, object => renderer.renderObject({ object }))}
          ${addRow}
        `
  }

  return html`<mwc-list part="property ${property.hasErrors ? 'invalid' : ''}">
    <mwc-list-item hasmeta part="property-header"><b>${localizedLabel(property.shape, { property: sh.name })}</b> ${menuElement}</mwc-list-item>
    ${editors()}
  </mwc-list>`
}

function onEnter(cb: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter') cb()
  }
}

property.loadDependencies = () => [
  import('../elements/mwc-item-lite.js'),
  import('../elements/mwc-property-menu.js'),
  import('@material/mwc-icon/mwc-icon.js'),
  import('@material/mwc-list/mwc-list.js'),
  import('@material/mwc-list/mwc-list-item.js'),
]

property.styles = css`
  mwc-list-item {
    --mdc-ripple-color: transparent;
    overflow: visible;
  }`

export const object: ObjectTemplate = function (renderer, param) {
  const { object } = param
  const { actions, property } = renderer

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

  return html`<mwc-item-lite part="editor ${object.hasErrors ? 'invalid' : ''}" ?has-options="${hasOptions}">
    ${renderer.renderEditor()}
    ${metaSlot}
  </mwc-item-lite>`
}

object.loadDependencies = () => [
  import('../elements/mwc-item-lite.js'),
  import('../elements/mwc-editor-toggle.js'),
]
