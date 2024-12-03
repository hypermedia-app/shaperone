import type { Store } from '../../../state/index.js'

export function createFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  return () => {
    dispatch.form.validate()
  }
}
