import { PropertyRenderer, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { NamedNode } from 'rdf-js'
import { renderEditor } from './editor'

export const renderObject: PropertyRenderer['renderObject'] = function ({ object }) {
  const { dispatch, form, templates } = this.context
  const { focusNode, property } = this

  const actions = {
    ...this.actions,
    selectEditor(editor: NamedNode): void {
      dispatch.forms.selectEditor({
        form,
        focusNode: focusNode.focusNode,
        property: property.shape,
        object,
        editor,
      })
    },
    remove(): void {
      dispatch.forms.removeObject({ form, focusNode: focusNode.focusNode, property: property.shape, object })
    },
  }

  const context: ObjectRenderer = {
    ...this,
    actions,
    object,
    renderEditor,
  }

  return templates.object(context, { object })
}
