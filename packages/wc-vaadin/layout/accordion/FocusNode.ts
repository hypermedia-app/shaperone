import { Sh1FocusNode } from '@hydrofoil/shaperone-wc/components/sh1-focus-node.js'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

export default class AccordionFocusNode extends Sh1FocusNode {
  get dependencies() {
    return {
      'vaadin-accordion': import('@vaadin/vaadin-accordion/vaadin-accordion.js').then(m => m.Accordion),
      'vaadin-accordion-panel': import('@vaadin/vaadin-accordion/vaadin-accordion-panel.js').then(m => m.AccordionPanel),
    }
  }

  renderWhenReady() {
    return html`
      <vaadin-accordion .opened="${this.focusNode!.groups.findIndex(g => g.selected)}"
                        @opened-changed="${this.selectGroup}">
        ${repeat(this.focusNode!.groups, group => this.renderGroup(group))}
      </vaadin-accordion>`
  }

  renderGroup(group: PropertyGroupState) {
    const groupName = group.group?.id.value || 'default'
    return html`<vaadin-accordion-panel .opened="${group.selected}">
      <div slot="summary">${localizedLabel(group.group, { fallback: 'Ungrouped properties' })}</div>
      <div part="property-group">
        <slot name="${groupName}"></slot>
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
