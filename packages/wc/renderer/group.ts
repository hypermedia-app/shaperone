import { FocusNodeRenderer, GroupRenderer } from '@hydrofoil/shaperone-core/renderer'
import { byGroup, onlySingleProperty } from '@hydrofoil/shaperone-core/lib/filter'
import { renderProperty } from './property'

export const renderGroup: FocusNodeRenderer['renderGroup'] = function ({ group }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const properties = focusNode.properties
    .filter(byGroup(group?.group))
    .filter(onlySingleProperty)
  const actions = {
    ...this.actions,
    selectGroup: () => dispatch.forms.selectGroup({ form, focusNode: focusNode.focusNode, group: group?.group }),
  }

  const context: GroupRenderer = {
    ...this,
    actions,
    group,
    renderProperty,
  }

  return templates.group.call(context, {
    properties,
  })
}
