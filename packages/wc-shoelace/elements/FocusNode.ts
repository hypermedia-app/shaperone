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
    if (!this.groups) {
      return html``
    }

    if (this.groups?.length === 1) {
      return html`${this.renderGroup(this.groups[0])}`
    }

    return html`
      <sl-tab-group>
        ${repeat(this.groups || [], this.renderGroupTab.bind(this))}
      </sl-tab-group>`
  }

  private renderGroupTab(group: PropertyGroupState) {
    const groupName = group.group?.id.value || 'default'

    return html`
        <sl-tab slot="nav" panel="${groupName}" ?active="${group.selected}">${localizedLabel(group.group)}</sl-tab>
        <sl-tab-panel name="${groupName}" ?active="${group.selected}">
          ${this.renderGroup(group)}
        </sl-tab-panel>
      `
  }

  get dependencies() {
    return {
      'sl-tab-group': import('@shoelace-style/shoelace/dist/components/tab-group/tab-group.component.js'),
      'sl-tab': import('@shoelace-style/shoelace/dist/components/tab/tab.js'),
      'sl-tab-panel': import('@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'),
    }
  }
}
