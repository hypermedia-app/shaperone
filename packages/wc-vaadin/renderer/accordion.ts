import { FocusNodeRenderStrategy, GroupRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'
import { html } from '@hydrofoil/shaperone-wc'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'

export const AccordionFocusNodeRenderer: FocusNodeRenderStrategy = (focusNode, actions, renderGroup) => {
  return html`
    ${focusNode.shape.getString(sh.name)}
    <vaadin-accordion>
      ${repeat(focusNode.groups, renderGroup)}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => {
  return [import('@vaadin/vaadin-accordion/vaadin-accordion')]
}

export const AccordionGroupingRenderer: GroupRenderStrategy = ({ group, properties, renderProperty, actions }) => {
  function selectGroup(e: CustomEvent) {
    if (e.detail.value) {
      actions.selectGroup()
    }
  }

  const header = group.group?.getString(sh.name) || 'Ungrouped properties'

  return html`<vaadin-accordion-panel .opened="${group.selected}" @opened-changed="${selectGroup}">
    <div slot="summary">${header}</div>
    ${repeat(properties, renderProperty)}
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
