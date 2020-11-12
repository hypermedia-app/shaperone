import { PropertyShape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import { FocusNode } from '../../../index'
import { BaseParams } from '../../index'
import type { Store } from '../../../state'

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
  }
}
