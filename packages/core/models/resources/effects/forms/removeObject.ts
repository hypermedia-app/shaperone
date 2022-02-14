import type { Store } from '../../../../state'
import * as removeObject from '../../../forms/reducers/removeObject'
import { notify } from '../../lib/notify'
import { PropertyObjectState } from '../../../forms'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph'

type Params = Omit<removeObject.RemoveObjectParams, 'object'> & {
  object: Pick<PropertyObjectState, 'object'>
}

export default function (store: Store) {
  return function ({ form, focusNode, property, object: removed }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
    if (!state?.graph || !removed.object) {
      return
    }

    const pathProperty = property.getPathProperty(true)

    if (!removed.object) {
      return
    }

    state.graph.node(focusNode).deleteOut(pathProperty.id, removed.object)
    deleteOrphanedSubgraphs(removed.object.toArray())

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
