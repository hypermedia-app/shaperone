import { PropertyRenderer, ObjectRenderer, ObjectActions } from '@hydrofoil/shaperone-core/renderer.js'
import type { NamedNode } from '@rdfjs/types'
import { renderEditor } from './editor.js'

export const renderObject: PropertyRenderer['renderObject'] = function ({ object }) {
  const { dispatch, form, templates } = this.context
  const { focusNode, property, actions } = this

  const objectActions: ObjectActions = {
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
      actions.removeObject(object)
    },
  }

  const context: ObjectRenderer = {
    ...this,
    actions: {
      ...actions,
      ...objectActions,
    },
    object,
    renderEditor,
  }

  return templates.object(context, { object })
}
