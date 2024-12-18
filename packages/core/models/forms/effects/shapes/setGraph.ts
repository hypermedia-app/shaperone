import type { Store } from '../../../../state/index.js'
import type { ShapeState } from '../../../shapes/index.js'

export default function setGraph(store: Store) {
  const dispatch = store.getDispatch()
  let previousShapes: ShapeState | undefined

  return () => {
    const { form, shapes } = store.getState()
    const shapesState = shapes
    const graph = store.getState().resources?.graph
    if (!graph) {
      return
    }

    if (previousShapes === shapesState) {
      return
    }

    previousShapes = shapesState
    const currentNodes = [...form.focusStack]

    dispatch.form.truncateFocusNodes({})
    currentNodes.forEach((focusNode) => {
      dispatch.form.createFocusNodeState({
        focusNode,
        shape: shapesState?.preferredRootShape,
        appendToStack: true,
      })
    })
  }
}
