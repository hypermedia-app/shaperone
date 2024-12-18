import { html } from 'lit'
import { FocusNodeElement } from '@hydrofoil/shaperone-wc/components/index.js'
import type { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(FocusNodeElement) {
  get groups() {
    return this.focusNode?.groups
  }

  renderWhenReady() {
    if (!this.groups || this.groups.length === 1) {
      return html`
          <slot></slot>`
    }

    return html`
      <sl-tab-group>
        ${repeat(this.groups, this.renderGroupTab)}
      </sl-tab-group>`
  }

  private renderGroupTab(group: PropertyGroupState) {
    const groupName = group.group?.id.value || 'default'

    return html`
        <sl-tab slot="nav" panel="${groupName}" ?active="${group.selected}">${localizedLabel(group.group)}</sl-tab>
        <sl-tab-panel name="${groupName}" ?active="${group.selected}">
          <slot name="${groupName}"></slot>
        </sl-tab-panel>
      `
  }

  * dependencies() {
    yield import('@shoelace-style/shoelace/dist/components/tab-group/tab-group.js')
    yield import('@shoelace-style/shoelace/dist/components/tab/tab.js')
    yield import('@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js')
  }
}
