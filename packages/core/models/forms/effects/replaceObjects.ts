import type { PropertyShape } from '@rdfine/shacl'
import type { Term } from '@rdfjs/types'
import type { FocusNode } from '../../../index.js'
import type { Store } from '../../../state/index.js'

export function replaceObjects(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ focusNode, property, terms }: {
    focusNode: FocusNode
    property: PropertyShape
    terms: Term[]
  }) {
    const { editors, resources } = store.getState()
    const graph = resources?.graph
    if (!graph) {
      return
    }
    const objects = graph.node(terms)

    dispatch.form.setPropertyObjects({
      editors,
      focusNode,
      property,
      objects,
    })

    dispatch.form.validate()
  }
}
