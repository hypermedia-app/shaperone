import type { Store } from '../../../state/index.js'
import { Params } from '../reducers/selectShape.js'

export function selectShape(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, shape }: Params) {
    const { editors, shapes, resources, forms, components } = store.getState()
    const graph = resources.get(form)?.graph
    const formState = forms.get(form)
    if (!graph || !formState) {
      return
    }

    dispatch.forms.createFocusNodeState({
      form,
      focusNode,
      editors,
      components,
      shape,
      shapes: shapes.get(form)?.shapes || [],
      shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
    })
  }
}
