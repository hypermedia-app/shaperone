import { html, LitElement } from 'lit'
import type { FocusNodeElement } from '@hydrofoil/shaperone-wc/components/index.js'
import type { FocusNodeState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'

export { ShSlProperty as property } from './elements/sh-sl-property.js'
export { default as object } from './elements/sh-sl-object.js'
export { Button as button } from './elements/Button.js'

export class focusNode extends LitElement implements FocusNodeElement {
  @property({ type: Object })
  public focusNode!: FocusNodeState

  render() {
    if (this.focusNode.groups.length === 1) {
      return html`
        <sl-tab-group>
          <slot></slot>
        </sl-tab-group>`
    }
  }
}
/*
export const focusNode: FocusNodeTemplate = (renderer, { focusNode: { groups } }) => {
  if (groups.length === 1) {
    return renderer.renderGroup({ group: groups[0] })
  }

  return html`<sl-tab-group>
      ${repeat(groups, (group) => {
    const groupName = group.group?.id.value || 'default'

    return html`
          <sl-tab slot="nav" panel="${groupName}" ?active="${group.selected}">${localizedLabel(group.group)}</sl-tab>
          <sl-tab-panel name="${groupName}" ?active="${group.selected}">
            ${renderer.renderGroup({ group })}
          </sl-tab-panel>
        `
  })}
    </sl-tab-group>`
}

focusNode.loadDependencies = () => [
  import('@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'),
  import('@shoelace-style/shoelace/dist/components/tab/tab.js'),
  import('@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'),
]
*/
