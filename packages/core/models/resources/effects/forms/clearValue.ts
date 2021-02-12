import type { Store } from '../../../../state'
import type { ClearValueParams } from '../../../forms/reducers/updateObject'
import { notify } from '../../lib/notify'
import { PropertyObjectState } from '../../../forms'
import { defaultValue } from '../../lib/defaultValue'

type Params = Omit<ClearValueParams, 'object'> & {
  object: Pick<PropertyObjectState, 'object'>
}

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, property, object: removed }: Params) {
    const { resources, editors } = store.getState()
    const state = resources.get(form)
    if (!state?.graph || !removed.object) {
      return
    }

    const pathProperty = property.getPathProperty()!

    if (!removed.object) {
      return
    }

    state.graph.node(focusNode).deleteOut(pathProperty.id, removed.object)
    const pointer = defaultValue(property, focusNode)
    if (pointer) {
      const predicate = property.getPathProperty()!.id
      state.graph.node(focusNode).addOut(predicate, pointer)
      dispatch.forms.setDefaultValue({
        form,
        focusNode,
        property,
        value: pointer.toArray()[0],
        editors,
      })
    }

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
