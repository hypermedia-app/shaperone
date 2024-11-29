import type{ GraphPointer } from 'clownface'
import type { Store } from '../../../../state/index.js'
import type * as setRoot from '../../../resources/reducers/setRoot.js'

function samePointers(left: GraphPointer, right?: GraphPointer) {
  return left.dataset === right?.dataset && left.term.equals(right.term)
}

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, rootPointer }: setRoot.Params) => {
    const { forms, editors, shapes, resources, components } = store.getState()
    const formState = forms.get(form)
    const graph = resources.get(form)?.graph
    const shapesState = shapes.get(form)
    if (!graph || !formState) {
      return
    }

    if (samePointers(rootPointer, formState.focusStack[0])) {
      return
    }

    if (!formState.focusStack.length || rootPointer.value !== formState.focusStack[0].value) {
      dispatch.forms.truncateFocusNodes({ form, focusNode: rootPointer })
      dispatch.forms.createFocusNodeState({
        form,
        focusNode: rootPointer,
        editors,
        components,
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
        shapes: shapesState?.shapes || [],
        shape: shapesState?.preferredRootShape,
        replaceStack: true,
      })
      return
    }

    for (const currentFocusNode of formState.focusStack) {
      const focusNode = rootPointer.node(currentFocusNode)
      if (!focusNode.out().values) break

      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        components,
        shapes: shapesState?.shapes || [],
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    }
  }
}
