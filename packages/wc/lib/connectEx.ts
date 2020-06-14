import { connect, Constructor, Connectable, Store, ModelsState } from '@captaincodeman/rdx'
import * as models from '@hydrofoil/shaperone-core/state/models'

export function connectEx<T extends Constructor<Connectable>, SS extends Store<ModelsState<typeof models>>>(
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
