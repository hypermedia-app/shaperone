import type { PropertyRenderer, ObjectRenderer, ObjectActions } from '@hydrofoil/shaperone-core/renderer.js'
import type { NamedNode } from '@rdfjs/types'
import { html } from 'lit'

export const renderObject: PropertyRenderer['renderObject'] = function ({ object }) {
  const { dispatch, env } = this.context
  const { focusNode, property, actions } = this

  const objectActions: ObjectActions = {
    selectEditor(editor: NamedNode): void {
      dispatch.form.selectEditor({
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
  }

  return html`<sh1-object .object="${object}">
    ${renderEditor(context)}
  </sh1-object>`
}
