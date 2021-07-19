import type { Store } from '../../../../state'
import { SetShapesGraphParams } from '../../../shapes/reducers'
import { matchShapes } from '../../../shapes/lib'
import { ShapeState } from '../../../shapes'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()
  let previousShapes: ShapeState | undefined

  return ({ form }: SetShapesGraphParams) => {
    const { editors, forms, shapes, components } = store.getState()
    const formState = forms.get(form)
    const shapesState = shapes.get(form)
    const graph = store.getState().resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    if (previousShapes === shapesState) {
      return
    }

    previousShapes = shapesState
    formState.focusStack.forEach((focusNode) => {
      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        components,
        shape: shapesState?.preferredRootShape,
        shapes: matchShapes(shapes.get(form)?.shapes).to(focusNode),
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    })
  }
}
