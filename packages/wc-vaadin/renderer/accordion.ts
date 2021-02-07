import { FocusNodeTemplate, GroupTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit-html/directives/repeat'

export const AccordionFocusNodeRenderer: FocusNodeTemplate = function ({ focusNodeState }) {
  const { actions } = this

  function selectGroup(e: CustomEvent) {
    actions.selectGroup(focusNodeState.groups[e.detail.value]?.group)
  }

  return html`
    <vaadin-accordion .opened="${focusNodeState.groups.findIndex(g => g.selected)}"
                      @opened-changed="${selectGroup}">
      ${repeat(focusNodeState.groups, groupState => this.group({ groupState }))}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => [import('@vaadin/vaadin-accordion/vaadin-accordion')]

export const AccordionGroupingRenderer: GroupTemplate = function ({ properties }) {
  const { groupState } = this

  const header = groupState.group?.label || 'Ungrouped properties'

  return html`<vaadin-accordion-panel .opened="${groupState.selected}">
    <div slot="summary">${header}</div>
    <div part="property-group">
      ${repeat(properties, property => this.property({ property }))}
    </div>
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
