import type { Store } from '../../../state'
import { BaseParams } from '../../index'

export function connect(store: Store) {
  const dispatch = store.getDispatch()
  return ({ form }: BaseParams) => {
    const { forms, editors, shapes, resources } = store.getState()
    const shapesState = shapes.get(form)
    const formState = forms.get(form)

    const rootPointer = resources.get(form)?.rootPointer

    if (rootPointer && formState) {
      dispatch.forms.createFocusNodeState({
        form,
        focusNode: rootPointer,
        editors,
        shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
        shapes: shapesState?.shapes || [],
        shape: shapesState?.preferredRootShape,
        replaceStack: true,
      })
    }

    dispatch.resources.connect(form)
    dispatch.shapes.connect(form)
  }
}

export function disconnect(store: Store) {
  const dispatch = store.getDispatch()
  return (form: symbol) => {
    dispatch.resources.disconnect(form)
    dispatch.shapes.disconnect(form)
  }
}
