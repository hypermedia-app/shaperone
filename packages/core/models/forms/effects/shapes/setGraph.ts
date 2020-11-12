import type { Store } from '../../../../state'
import { SetShapesGraphParams } from '../../../shapes/reducers'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, shapesGraph }: SetShapesGraphParams) => {
    const { editors, forms, shapes } = store.getState()
    const formState = forms.get(form)
    const currentGraph = shapes.get(form)?.shapesGraph
    const graph = store.getState().resources.get(form)?.graph
    if (!graph || !formState || currentGraph?.dataset === shapesGraph || currentGraph === shapesGraph) {
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
