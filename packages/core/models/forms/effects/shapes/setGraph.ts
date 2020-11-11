import type { Store } from '../../../../state'
import { SetShapesGraphParams } from '../../../shapes/reducers'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form }: SetShapesGraphParams) => {
    const { editors, forms, shapes } = store.getState()
    const formState = forms.instances.get(form)
    const graph = store.getState().resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    formState.focusStack.forEach((focusNode) => {
      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        shapes: shapes.get(form)?.shapes || [],
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    })
  }
}
