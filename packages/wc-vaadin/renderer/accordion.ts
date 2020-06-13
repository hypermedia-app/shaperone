import { FocusNodeRenderStrategy, GroupRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'
import { html } from '@hydrofoil/shaperone-wc'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'

export const AccordionFocusNodeRenderer: FocusNodeRenderStrategy = (focusNode, actions, renderGroups) => {
  return html`
    ${focusNode.shape.getString(sh.name)}
    <vaadin-accordion>
        ${renderGroups()}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => {
  return [import('@vaadin/vaadin-accordion/vaadin-accordion')]
}

export const AccordionGroupingRenderer: GroupRenderStrategy = (group, properties, renderProperty) => {
  const header = group?.getString(sh.name) || 'Ungrouped properties'

  return html`<vaadin-accordion-panel>
    <div slot="summary">${header}</div>
    ${repeat(properties, renderProperty)}
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
