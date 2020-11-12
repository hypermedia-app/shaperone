import type { Store } from '../../../state'
import { Params } from '../reducers/selectShape'

export function selectShape(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, shape }: Params) {
    const { editors, shapes, resources, forms } = store.getState()
    const graph = resources.get(form)?.graph
    const formState = forms.instances.get(form)
    if (!graph || !formState) {
      return
    }

    dispatch.forms.createFocusNodeState({
      form,
      focusNode,
      editors,
      shape,
      shapes: shapes.get(form)?.shapes || [],
      shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
    })
  }
}
