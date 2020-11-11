import * as updateObject from '../../../forms/reducers/updateObject'
import { getPathProperty } from '../../lib/property'
import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'

export default function (store: Store) {
  return function ({ form, focusNode, property, objects }: updateObject.ReplaceObjectsParams) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = getPathProperty(property)!.id

    state?.graph?.node(focusNode)
      .deleteOut(pathProperty)
      .addOut(pathProperty, objects)

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
