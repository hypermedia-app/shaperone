import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import '@shoelace-style/shoelace/dist/components/details/details.js'
import { isResource } from 'is-graph-pointer'
import type { ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

interface Locals extends ComponentInstance {
  open?: boolean
}

export const render: SingleEditorComponent<Locals>['render'] = function details({ value, renderer, property: { shape: { node } }, updateComponentState }) {
  const focusNode = value.object

  if (isResource(focusNode)) {
    return html`
      <sl-details .open="${value.componentState.open || false}"
                  .summary="${localizedLabel(focusNode, { fallback: localizedLabel(node?.pointer) })}"
                  @sl-show="${() => updateComponentState({ open: true })}"
                  @sl-hide="${() => updateComponentState({ open: false })}"
      >
        ${renderer.renderFocusNode({ focusNode, shape: node })}
      </sl-details>
    `
  }

  return html``
}
