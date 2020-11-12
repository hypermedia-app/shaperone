import type { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../../index'
import type { BaseParams } from '../../index'
import type { Store } from '../../../state'

export function pushFocusNode(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, focusNode, property }: { focusNode: FocusNode; property: PropertyShape } & BaseParams): void => {
    const { editors, shapes, resources, forms } = store.getState()
    const graph = resources.get(form)?.graph
    const formState = forms.get(form)
    if (!graph || !formState) {
      return
    }

    dispatch.forms.createFocusNodeState({
      appendToStack: true,
      form,
      focusNode,
      editors,
      shape: property.node,
      shapes: shapes.get(form)?.shapes || [],
      shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
    })
  }
}
