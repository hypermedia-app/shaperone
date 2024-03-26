import { FocusNodeRenderer, GroupRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { PropertyGroup } from '@rdfine/shacl'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { renderProperty } from './property.js'

function byGroup(group: PropertyGroup | undefined) {
  return (property: PropertyState) => {
    if (!group && !property.shape.group) {
      return true
    }

    if (group && property.shape.group) {
      return group.id.equals(property.shape.group.id)
    }

    return false
  }
}

function onlySingleProperty(property: PropertyState) {
  if (Array.isArray(property.shape.path)) {
    return property.shape.path.length === 1
  }

  return true
}

export const renderGroup: FocusNodeRenderer['renderGroup'] = function ({ group }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const properties = focusNode.properties
    .filter(({ hidden }) => !hidden)
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

  return templates.group(context, {
    properties,
  })
}
