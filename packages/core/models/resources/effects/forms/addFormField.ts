import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'
import { Params } from '../../../forms/reducers/addFormField'
import { defaultValue } from '../../lib/defaultValue'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, property }: Pick<Params, 'form' | 'focusNode' | 'property'>): void {
    const { resources, editors } = store.getState()
    const state = resources.get(form)

    if (!state?.graph) {
      return
    }

    const pointer = defaultValue(property, focusNode)
    const predicate = property.getPathProperty(true).id
    if (!pointer || focusNode.has(predicate, pointer).terms.length) {
      return
    }

    state.graph.node(focusNode).addOut(predicate, pointer)
    notify({
      store,
      form,
      property,
      focusNode,
    })

    dispatch.forms.setDefaultValue({
      form,
      focusNode,
      property,
      value: pointer.toArray()[0],
      editors,
    })
  }
}
