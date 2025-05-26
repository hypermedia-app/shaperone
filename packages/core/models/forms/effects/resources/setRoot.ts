import type{ GraphPointer } from 'clownface'
import type { Store } from '../../../../state/index.js'
import type * as setRoot from '../../../resources/reducers/setRoot.js'

function samePointers(left: GraphPointer, right?: GraphPointer) {
  return left.dataset === right?.dataset && left.term.equals(right.term)
}

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return ({ rootPointer }: setRoot.Params) => {
    const { form, editors, shapes, resources, components } = store.getState()
    const { graph } = resources
    const shapesState = shapes
    if (!graph) {
      return
    }

    if (samePointers(rootPointer, form.focusStack[0])) {
      return
    }

    if (!form.focusStack.length || rootPointer.value !== form.focusStack[0].value) {
      dispatch.form.truncateFocusNodes({ focusNode: rootPointer })
      dispatch.form.createFocusNodeState({
        focusNode: rootPointer,
        shape: shapesState?.preferredRootShape,
        replaceStack: true,
      })
      return
    }

    for (const currentFocusNode of form.focusStack) {
      const focusNode = rootPointer.node(currentFocusNode)
      if (!focusNode.out().values) break

      dispatch.form.createFocusNodeState({
        focusNode,
      })
    }
  }
}
