import { FocusNodeTemplate, GroupTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit-html/directives/repeat'

export const AccordionFocusNodeRenderer: FocusNodeTemplate = function ({ focusNode }) {
  const { actions } = this

  function selectGroup(e: CustomEvent) {
    actions.selectGroup(focusNode.groups[e.detail.value]?.group)
  }

  return html`
    <vaadin-accordion .opened="${focusNode.groups.findIndex(g => g.selected)}"
                      @opened-changed="${selectGroup}">
      ${repeat(focusNode.groups, group => this.renderGroup({ group }))}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => [import('@vaadin/vaadin-accordion/vaadin-accordion')]

export const AccordionGroupingRenderer: GroupTemplate = function ({ properties }) {
  const { group } = this

  const header = group.group?.label || 'Ungrouped properties'

  return html`<vaadin-accordion-panel .opened="${group.selected}">
    <div slot="summary">${header}</div>
    <div part="property-group">
      ${repeat(properties, property => this.renderProperty({ property }))}
    </div>
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
