import { connect, Constructor, Connectable, Store } from '@captaincodeman/rdx'
import { FormState } from '@hydrofoil/shaperone-core/state'

export function connectEx<T extends Constructor<Connectable>, SS extends Store<{ form: FormState }>>(
  storeFactory: () => SS,
  base: T,
) {
  const store = storeFactory()

  class stateAwareConnected extends connect(store, base) {
    get store() {
      return store
    }
  }

  return stateAwareConnected
}
