import type { Store } from '../../../../state/index.js'
import type { ClearValueParams } from '../../../forms/reducers/updateObject.js'
import { notify } from '../../lib/notify.js'
import type { PropertyObjectState } from '../../../forms/index.js'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph.js'

type Params = Omit<ClearValueParams, 'object'> & {
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
