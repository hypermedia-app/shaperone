import { GraphPointer } from 'clownface'
import type { Store } from '../../../../state'
import * as updateObject from '../../../forms/reducers/updateObject'
import { getPathProperty } from '../../lib/property'
import { notify } from '../../lib/notify'

type Params = Omit<updateObject.UpdateObjectParams, 'object'> & {
  object: {
    object?: GraphPointer
  }
}

export default function (store: Store) {
  return function ({ form, focusNode, property, object, newValue }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = getPathProperty(property)!.id
    if (!state?.graph) {
      return
    }

    if (newValue.equals(object.object?.term)) {
      return
    }

    if (object.object) {
      state.graph.node(focusNode).deleteOut(pathProperty, object.object)
    }
    state.graph.node(focusNode).addOut(pathProperty, newValue)

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
