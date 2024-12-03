import type { Store } from '../../../../state/index.js'
import type { Params } from '../../../forms/reducers/addFormField.js'
import { defaultValue } from '../../lib/objectValue.js'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return function ({ focusNode, property, selectedEditor, overrides }: Pick<Params, 'focusNode' | 'property' | 'selectedEditor' | 'overrides'>): void {
    const { resources, editors } = store.getState()
    const state = resources

    if (!state?.graph) {
      return
    }

    const editorMeta = editors.metadata
    const pointer = defaultValue({ property, focusNode, editor: selectedEditor, overrides, editorMeta })
    const predicate = property.getPathProperty(true).id
    if (!pointer || focusNode.has(predicate, pointer).terms.length) {
      return
    }

    state.graph.node(focusNode).addOut(predicate, pointer)
    dispatch.form.notify({
      property,
      focusNode,
    })

    dispatch.form.setDefaultValue({
      focusNode,
      property,
      value: pointer.toArray()[0],
      editors,
    })
  }
}
