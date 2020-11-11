import type { Store } from '../../../../state'
import * as setRoot from '../../../resources/reducers/setRoot'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, rootPointer }: setRoot.Params) => {
    const { forms, editors, shapes, resources } = store.getState()
    const formState = forms.instances.get(form)
    const graph = resources.get(form)?.graph
    if (!graph || !formState) {
      return
    }

    const focusNode = rootPointer
    if (focusNode === formState.focusStack[0]) {
      return
    }

    if (!formState.focusStack.length || rootPointer.value !== formState.focusStack[0].value) {
      dispatch.forms.truncateFocusNodes({ form, focusNode })
      dispatch.forms.createFocusNodeState({
        form,
        focusNode,
        editors,
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
        shapes: shapes.get(form)?.shapes || [],
        replaceStack: true,
      })
      return
    }

    for (const currentFocusNode of formState.focusStack) {
      if (!currentFocusNode.out().values) break

      dispatch.forms.createFocusNodeState({
        form,
        focusNode: currentFocusNode,
        editors,
        shapes: shapes.get(form)?.shapes || [],
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
      })
    }
  }
}
