import { GroupRenderer, PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { renderObject } from './object.js'
import { renderMultiEditor } from './editor.js'

export const renderProperty: GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const actionParams = { form, focusNode: focusNode.focusNode, property: property.shape }

  const propertyActions: PropertyActions = {
    addObject: (arg = {}) => {
      dispatch.forms.addObject({ ...arg, ...actionParams })
    },
    removeObject: (arg) => {
      let object: PropertyObjectState | undefined
      if ('key' in arg) {
        object = arg
      } else {
        const term = 'termType' in arg ? arg : arg.term
        object = property.objects.find(pos => pos.object?.term.equals(term))
      }

      if (object) {
        dispatch.forms.removeObject({
          ...actionParams,
          object,
        })
      }
    },
    selectMultiEditor: () => dispatch.forms.selectMultiEditor(actionParams),
    selectSingleEditors: () => dispatch.forms.selectSingleEditors(actionParams),
  }

  const context: PropertyRenderer = {
    ...this,
    actions: {
      ...this.actions,
      ...propertyActions,
    },
    property,
    renderMultiEditor,
    renderObject,
  }

  return templates.property(context, { property })
}
