import * as updateObject from '../../../forms/reducers/updateObject'
import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph'

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
