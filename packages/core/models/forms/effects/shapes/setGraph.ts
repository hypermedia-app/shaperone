import type { Store } from '../../../../state/index.js'
import { matchShapes } from '../../../shapes/lib/index.js'
import type { ShapeState } from '../../../shapes/index.js'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()
  let previousShapes: ShapeState | undefined

  return () => {
    const { editors, form, shapes, components } = store.getState()
    const shapesState = shapes
    const graph = store.getState().resources?.graph
    if (!graph) {
      return
    }

    if (previousShapes === shapesState) {
      return
    }

    previousShapes = shapesState
    form.focusStack.forEach((focusNode) => {
      dispatch.form.createFocusNodeState({
        focusNode,
        editors,
        components,
        shape: shapesState?.preferredRootShape,
        shapes: matchShapes(shapes?.shapes).to(focusNode),
        shouldEnableEditorChoice: form.shouldEnableEditorChoice,
      })
    })
  }
}
