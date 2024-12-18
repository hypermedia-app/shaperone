import type { Store } from '../../../state/index.js'

export function replaceFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  return () => {
    dispatch.form.validate()
  }
}
