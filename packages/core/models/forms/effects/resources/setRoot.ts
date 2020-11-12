import type { Store } from '../../../../state'
import * as setRoot from '../../../resources/reducers/setRoot'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, rootPointer }: setRoot.Params) => {
    const { forms, editors, shapes, resources } = store.getState()
    const formState = forms.get(form)
    const graph = resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    if (rootPointer === formState.focusStack[0]) {
      return
    }

    if (!formState.focusStack.length || rootPointer.value !== formState.focusStack[0].value) {
      dispatch.forms.truncateFocusNodes({ form, focusNode: rootPointer })
      dispatch.forms.createFocusNodeState({
        form,
        focusNode: rootPointer,
        editors,
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
        shapes: shapes.get(form)?.shapes || [],
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
        shapes: shapes.get(form)?.shapes || [],
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    }
  }
}
