import type { Store } from '../../../state/index.js'
import type { Params } from '../reducers/selectShape.js'

export function selectShape(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ focusNode, shape }: Params) {
    const { editors, shapes, resources, form, components } = store.getState()
    const graph = resources?.graph
    if (!graph) {
      return
    }

    dispatch.form.createFocusNodeState({
      focusNode,
      editors,
      components,
      shape,
      shapes: shapes?.shapes || [],
      shouldEnableEditorChoice: form.shouldEnableEditorChoice,
    })
  }
}
