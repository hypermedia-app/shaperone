import type { GroupRenderer, PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { renderObject } from './object.js'

export const renderProperty: GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch } = this.context
  const { focusNode } = this

  const actionParams = { focusNode: focusNode.focusNode, property: property.shape }

  const propertyActions: PropertyActions = {
    removeObject: (arg) => {
      let object: PropertyObjectState | undefined
      if ('key' in arg) {
        object = arg
      } else {
        const term = 'termType' in arg ? arg : arg.term
        object = property.objects.find(pos => pos.object?.term.equals(term))
      }

      if (object) {
        dispatch.form.removeObject({
          ...actionParams,
          object,
        })
      }
    },
    selectMultiEditor: () => dispatch.form.selectMultiEditor(actionParams),
    selectSingleEditors: () => dispatch.form.selectSingleEditors(actionParams),
  }

  const context: PropertyRenderer = {
    ...this,
    actions: {
      ...this.actions,
      ...propertyActions,
    },
    property,
    renderObject,
  }

  return templates.property(context, { property })
}
