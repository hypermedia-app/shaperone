import { GroupRenderer, PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import clownface, { MultiPointer } from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { renderObject } from './object'
import { renderMultiEditor } from './editor'

export const renderProperty: GroupRenderer['renderProperty'] = function ({ property }) {
  const { dispatch, form, templates } = this.context
  const { focusNode } = this

  const actionParams = { form, focusNode: focusNode.focusNode, property: property.shape }

  const propertyActions: PropertyActions = {
    addObject: (arg) => {
      let overrides: MultiPointer | undefined
      if (arg && '_context' in arg) {
        overrides = arg
      } else if (arg) {
        overrides = clownface({ dataset: dataset() })
          .blankNode()
        if (arg.nodeKind) overrides.addOut(sh.nodeKind, arg.nodeKind)
        if (arg.editor) overrides.addOut(dash.editor, arg.editor)
      }
      dispatch.forms.addObject({ overrides, ...actionParams })
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
