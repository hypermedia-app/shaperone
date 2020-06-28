import { FocusNodeRenderStrategy, GroupRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit-html/directives/repeat'

export const AccordionFocusNodeRenderer: FocusNodeRenderStrategy = ({ focusNode, actions, renderGroup }) => {
  function selectGroup(e: CustomEvent) {
    actions.selectGroup(focusNode.groups[e.detail.value]?.group)
  }

  return html`
    <vaadin-accordion .opened="${focusNode.groups.findIndex(g => g.selected)}"
                      @opened-changed="${selectGroup}">
      ${repeat(focusNode.groups, renderGroup)}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => [import('@vaadin/vaadin-accordion/vaadin-accordion')]

export const AccordionGroupingRenderer: GroupRenderStrategy = ({ group, properties, renderProperty }) => {
  const header = group.group?.label || 'Ungrouped properties'

  return html`<vaadin-accordion-panel .opened="${group.selected}">
    <div slot="summary">${header}</div>
    ${repeat(properties, renderProperty)}
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
