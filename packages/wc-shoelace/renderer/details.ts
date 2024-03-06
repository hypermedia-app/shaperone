import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import '@shoelace-style/shoelace/dist/components/details/details.js'
import graphPointer from 'is-graph-pointer'
import type { ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'

interface Locals extends ComponentInstance {
  open?: boolean
}

export const render: SingleEditorComponent<Locals>['render'] = function details({ env, value, componentState, renderer, property: { shape }, updateComponentState }) {
  const { overrides, object: focusNode } = value
  const overrideShape = overrides?.out(sh.node)
  const node = graphPointer.isResource(overrideShape)
    ? env.rdfine.sh.NodeShape(overrideShape)
    : shape.node

  if (graphPointer.isResource(focusNode)) {
    return html`
      <sl-details .open="${componentState.open || false}"
                  .summary="${localizedLabel(focusNode, { fallback: localizedLabel(node?.pointer) }) as any}"
                  @sl-show="${() => updateComponentState({ open: true })}"
                  @sl-hide="${(e: Event) => {
    e.stopPropagation()
    updateComponentState({ open: false })
  }}"
      >
        ${renderer.renderFocusNode({ focusNode, shape: node })}
      </sl-details>
    `
  }

  return html``
}
