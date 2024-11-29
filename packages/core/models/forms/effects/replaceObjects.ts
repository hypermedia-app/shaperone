import type { PropertyShape } from '@rdfine/shacl'
import type { Term } from '@rdfjs/types'
import type { FocusNode } from '../../../index.js'
import type { BaseParams } from '../../index.js'
import type { Store } from '../../../state/index.js'

export function replaceObjects(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, property, terms }: {
    focusNode: FocusNode
    property: PropertyShape
    terms: Term[]
  } & BaseParams) {
    const { editors, resources } = store.getState()
    const graph = resources.get(form)?.graph
    if (!graph) {
      return
    }
    const objects = graph.node(terms)

    dispatch.forms.setPropertyObjects({
      form,
      editors,
      focusNode,
      property,
      objects,
    })

    dispatch.forms.validate({ form })
  }
}
