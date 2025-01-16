import type { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../../index.js'
import type { Store } from '../../../state/index.js'

export function pushFocusNode(store: Store) {
  const dispatch = store.getDispatch()

  return ({ focusNode, property }: { focusNode: FocusNode; property: PropertyShape }): void => {
    const { resources } = store.getState()
    const graph = resources?.graph
    if (!graph) {
      return
    }

    dispatch.form.createFocusNodeState({
      appendToStack: true,
      focusNode,
      shape: property.node,
    })
  }
}
