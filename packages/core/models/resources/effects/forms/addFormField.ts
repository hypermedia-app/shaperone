import type { Store } from '../../../../state'
import { notify } from '../../lib/notify.js'
import { Params } from '../../../forms/reducers/addFormField'
import { defaultValue } from '../../lib/objectValue.js'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, property, selectedEditor, nodeKind }: Pick<Params, 'form' | 'focusNode' | 'property' | 'selectedEditor' | 'nodeKind'>): void {
    const { resources, editors } = store.getState()
    const state = resources.get(form)

    if (!state?.graph) {
      return
    }

    const pointer = defaultValue({ property, focusNode, editor: selectedEditor, nodeKind })
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
