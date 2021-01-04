import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'
import { Params } from '../../../forms/reducers/addFormField'
import { defaultValue } from '../../lib/defaultValue'

export default function (store: Store) {
  return function ({ form, focusNode, property }: Pick<Params, 'form' | 'focusNode' | 'property'>): void {
    const { resources } = store.getState()
    const state = resources.get(form)

    if (!state?.graph) {
      return
    }

    const pointer = defaultValue(property, focusNode)
    const predicate = property.getPathProperty()!.id
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
  }
}
