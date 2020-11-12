import type { Store } from '../../../../state'
import * as removeObject from '../../../forms/reducers/removeObject'
import { getPathProperty } from '../../lib/property'
import { notify } from '../../lib/notify'
import { PropertyObjectState } from '../../../forms'

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

    const pathProperty = getPathProperty(property)!
    const objects = state.graph.node(focusNode).out(pathProperty.id).terms

    state.graph.node(focusNode)
      .deleteOut(pathProperty.id)
      .addOut(pathProperty.id, objects.filter(o => !o.equals(removed.object?.term)))

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
