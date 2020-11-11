import type { Store } from '../../../../state'
import * as updateObject from '../../../forms/reducers/updateObject'
import { getPathProperty } from '../../lib/property'
import { notify } from '../../lib/notify'

export default function (store: Store) {
  return function ({ form, focusNode, property, oldValue, newValue }: updateObject.UpdateObjectParams) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = getPathProperty(property)!.id
    if (!state?.graph) {
      return
    }

    const objects = state.graph.node(focusNode)
      .out(pathProperty)
      .terms
      .filter(term => !term.equals(oldValue))

    state.graph.node(focusNode)
      .deleteOut(pathProperty)
      .addOut(pathProperty, [...objects, newValue])

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
