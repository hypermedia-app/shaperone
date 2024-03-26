import * as updateObject from '../../../forms/reducers/updateObject.js'
import type { Store } from '../../../../state/index.js'
import { notify } from '../../lib/notify.js'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph.js'

type Params = Pick<updateObject.ReplaceObjectsParams, 'form' | 'focusNode' | 'property' | 'objects'>

export default function (store: Store) {
  return function ({ form, focusNode, property, objects }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = property.getPathProperty(true).id

    const currentValues = state?.graph?.node(focusNode).out(pathProperty)
    state?.graph?.node(focusNode)
      .deleteOut(pathProperty)
      .addOut(pathProperty, objects)
    if (currentValues) {
      deleteOrphanedSubgraphs(currentValues.toArray())
    }

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
