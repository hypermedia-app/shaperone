import type { FocusNodeRenderStrategy, GroupRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'
import { html } from '@hydrofoil/shaperone-wc'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit-html/directives/repeat'
import { styleMap } from 'lit-html/directives/style-map'
import { PropertyGroupState } from '@hydrofoil/shaperone-core/state'

export const TabsFocusNodeRenderer: FocusNodeRenderStrategy = (focusNode, actions, renderGroup) => {
  function renderTab(group: PropertyGroupState) {
    const header = group.group?.getString(sh.name) || 'Ungrouped properties'

    return html`<mwc-tab label="${header}" @MDCTab:interacted="${() => actions.selectGroup(group.group)}"></mwc-tab>`
  }

  return html`
    ${focusNode.shape?.getString(sh.name)}
    <mwc-tab-bar .activeIndex="${focusNode.groups.findIndex(g => g.selected)}">
        ${repeat(focusNode.groups, renderTab)}
    </mwc-tab-bar>
    ${repeat(focusNode.groups, renderGroup)}`
}

TabsFocusNodeRenderer.loadDependencies = () => {
  return [
    import('@material/mwc-tab-bar/mwc-tab-bar'),
    import('@material/mwc-tab/mwc-tab'),
  ]
}

export const TabsGroupRenderer: GroupRenderStrategy = ({ group, properties, renderProperty }) => {
  const styles = {
    display: group.selected ? 'block' : 'none',
  }

  return html`<div style="${styleMap(styles)}">
    ${repeat(properties, renderProperty)}
  </div>`
}
