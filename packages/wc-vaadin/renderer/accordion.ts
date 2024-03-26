import { FocusNodeTemplate, GroupTemplate } from '@hydrofoil/shaperone-wc/templates.js'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

export const AccordionFocusNodeRenderer: FocusNodeTemplate = function (renderer, { focusNode }) {
  const { actions } = renderer

  function selectGroup(e: CustomEvent) {
    actions.selectGroup(focusNode.groups[e.detail.value]?.group)
  }

  return html`
    <vaadin-accordion .opened="${focusNode.groups.findIndex(g => g.selected)}"
                      @opened-changed="${selectGroup}">
      ${repeat(focusNode.groups, group => renderer.renderGroup({ group }))}
    </vaadin-accordion>`
}

AccordionFocusNodeRenderer.loadDependencies = () => [import('@vaadin/vaadin-accordion/vaadin-accordion.js')]

export const AccordionGroupingRenderer: GroupTemplate = function (renderer, { properties }) {
  const { group } = renderer

  return html`<vaadin-accordion-panel .opened="${group.selected}">
    <div slot="summary">${localizedLabel(group.group, { fallback: 'Ungrouped properties' })}</div>
    <div part="property-group">
      ${repeat(properties, property => renderer.renderProperty({ property }))}
    </div>
  </vaadin-accordion-panel>`
}

AccordionGroupingRenderer.loadDependencies = AccordionFocusNodeRenderer.loadDependencies
