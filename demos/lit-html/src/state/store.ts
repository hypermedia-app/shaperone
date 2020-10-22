import { createStore, devtools, ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { config } from './config'

export const store = (() => {
  const store = createStore(config)

  return () => {
    if (window.Shaperone?.DEBUG === true) {
      return devtools(store)
    }

    return store
  }
})()

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>
