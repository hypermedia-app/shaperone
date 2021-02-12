import { GroupRenderer, PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { renderObject } from './object'
import { renderMultiEditor } from './editor'

export const renderProperty: GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const actionParams = { form, focusNode: focusNode.focusNode, property: property.shape }

  const propertyActions: PropertyActions = {
    addObject: () => dispatch.forms.addObject(actionParams),
    removeObject: (termOrPointer) => {
      const term = 'termType' in termOrPointer ? termOrPointer : termOrPointer.term
      const object = property.objects.find(pos => pos.object?.term.equals(term))

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
