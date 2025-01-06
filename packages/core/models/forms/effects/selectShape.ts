import type { Store } from '../../../state/index.js'
import type { Params } from '../reducers/selectShape.js'

export function selectShape(store: Store) {
  const dispatch = store.getDispatch()

  return function ({ focusNode, shape }: Params) {
    const { resources } = store.getState()
    const graph = resources?.graph
    if (!graph) {
      return
    }

    dispatch.form.createFocusNodeState({
      focusNode,
      shape,
    })
  }
}
