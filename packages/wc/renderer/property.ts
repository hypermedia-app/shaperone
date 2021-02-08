import { GroupRenderer, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { renderObject } from './object'
import { renderMultiEditor } from './editor'

export const renderProperty: GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const actions = {
    ...this.actions,
    addObject: () => dispatch.forms.addObject({ form, focusNode: focusNode.focusNode, property: property.shape }),
    selectMultiEditor: () => dispatch.forms.selectMultiEditor({ form, focusNode: focusNode.focusNode, property: property.shape }),
    selectSingleEditors: () => dispatch.forms.selectSingleEditors({ form, focusNode: focusNode.focusNode, property: property.shape }),
  }

  const context: PropertyRenderer = {
    ...this,
    actions,
    property,
    renderMultiEditor,
    renderObject,
  }

  return templates.property.call(context, { property })
}
