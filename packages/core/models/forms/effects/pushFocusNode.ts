import type { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../../index.js'
import type { BaseParams } from '../../index.js'
import type { Store } from '../../../state/index.js'
import { matchShapes } from '../../shapes/lib/index.js'

export function pushFocusNode(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, focusNode, property }: { focusNode: FocusNode; property: PropertyShape } & BaseParams): void => {
    const { editors, shapes, resources, forms, components } = store.getState()
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
      components,
      shape: property.node,
      shapes: matchShapes(shapes.get(form)?.shapes).to(focusNode),
      shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
    })
  }
}
