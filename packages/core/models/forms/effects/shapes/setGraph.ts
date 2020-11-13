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
    const shapesGraph = shapes.get(form)?.shapesGraph
    const graph = store.getState().resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    if (previousShapes && previousShapes === shapesGraph) {
      return
    }

    previousShapes = shapesGraph
    formState.focusStack.forEach((focusNode) => {
      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        shapes: matchShapes(shapes.get(form)?.shapes).to(focusNode),
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    })
  }
}
