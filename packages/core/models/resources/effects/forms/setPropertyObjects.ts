import * as updateObject from '../../../forms/reducers/updateObject'
import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'

type Params = Pick<updateObject.ReplaceObjectsParams, 'form' | 'focusNode' | 'property' | 'objects'>

export default function (store: Store) {
  return function ({ form, focusNode, property, objects }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = property.getPathProperty(true).id

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
