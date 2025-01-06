import { Sh1FocusNode } from '@hydrofoil/shaperone-wc/components/sh1-focus-node.js'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { GlobalDependencyLoader } from '@hydrofoil/shaperone-wc'

export default class AccordionFocusNode extends GlobalDependencyLoader(Sh1FocusNode) {
  * dependencies() {
    yield import('@vaadin/accordion').then(m => this.registry?.define('vaadin-accordion', m.Accordion))
    yield import('@vaadin/accordion/vaadin-accordion-panel.js').then(m => this.registry?.define('vaadin-accordion-panel', m.AccordionPanel))
  }

  render() {
    return html`
      <vaadin-accordion .opened="${this.focusNode!.groups.findIndex(g => g.selected)}"
                        @opened-changed="${this.selectGroup}">
        ${repeat(this.focusNode!.groups, group => this.renderGroupPanel(group))}
      </vaadin-accordion>`
  }

  renderGroupPanel(group: PropertyGroupState) {
    return html`<vaadin-accordion-panel .opened="${group.selected}">
      <div slot="summary">${localizedLabel(group.group, { fallback: 'Ungrouped properties' })}</div>
      <div part="property-group">
        ${this.renderGroup(group)}
      </div>
    </vaadin-accordion-panel>`
  }

  selectGroup() {
    this.dispatchEvent(new CustomEvent('group-selected', {
      detail: {
        value: this.focusNode!.groups.findIndex(g => g.selected),
      },
    }))
  }
}
