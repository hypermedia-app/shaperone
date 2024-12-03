import type * as updateObject from '../../../forms/reducers/updateObject.js'
import type { Store } from '../../../../state/index.js'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph.js'

type Params = Pick<updateObject.ReplaceObjectsParams, 'focusNode' | 'property' | 'objects'>

export default function (store: Store) {
  return function ({ focusNode, property, objects }: Params) {
    const { resources } = store.getState()
    const state = resources
    const pathProperty = property.getPathProperty(true).id

    const currentValues = state?.graph?.node(focusNode).out(pathProperty)
    state?.graph?.node(focusNode)
      .deleteOut(pathProperty)
      .addOut(pathProperty, objects)
    if (currentValues) {
      deleteOrphanedSubgraphs(currentValues.toArray())
    }

    store.getDispatch().form.notify({
      property,
      focusNode,
    })
  }
}
