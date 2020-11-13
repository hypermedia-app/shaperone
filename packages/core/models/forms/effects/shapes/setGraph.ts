import { AnyPointer } from 'clownface'
import type { Store } from '../../../../state'
import { SetShapesGraphParams } from '../../../shapes/reducers'
import { matchShapes } from '../../../shapes/lib'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()
  let previousShapes: AnyPointer | undefined

  return ({ form }: SetShapesGraphParams) => {
    const { editors, forms, shapes } = store.getState()
    const formState = forms.get(form)
    const shapesState = shapes.get(form)
    const graph = store.getState().resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    if (previousShapes && previousShapes === shapesState?.shapesGraph) {
      return
    }

    previousShapes = shapesState?.shapesGraph
    formState.focusStack.forEach((focusNode) => {
      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        shape: shapesState?.preferredRootShape,
        shapes: matchShapes(shapes.get(form)?.shapes).to(focusNode),
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    })
  }
}
