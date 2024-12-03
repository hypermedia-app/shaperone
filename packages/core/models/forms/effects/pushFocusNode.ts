import type { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../../index.js'
import type { Store } from '../../../state/index.js'
import { matchShapes } from '../../shapes/lib/index.js'

export function pushFocusNode(store: Store) {
  const dispatch = store.getDispatch()

  return ({ focusNode, property }: { focusNode: FocusNode; property: PropertyShape }): void => {
    const { editors, shapes, resources, form, components } = store.getState()
    const graph = resources?.graph
    if (!graph) {
      return
    }

    dispatch.form.createFocusNodeState({
      appendToStack: true,
      focusNode,
      editors,
      components,
      shape: property.node,
      shapes: matchShapes(shapes.shapes).to(focusNode),
      shouldEnableEditorChoice: form.shouldEnableEditorChoice,
    })
  }
}
