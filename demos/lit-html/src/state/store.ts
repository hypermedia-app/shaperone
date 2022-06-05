import { createStore, devtools, ModelStore, StoreDispatch, StoreState, persist } from '@captaincodeman/rdx'
import { config } from './config'

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

export const store = (() => {
  const store = persist<State, any>(createStore(config), {
    persist(state: State) {
      const { shape, resource } = state
      const { serialized, format, options } = shape

      return {
        shape: {
          serialized,
          format,
          quads: [],
          dataset: undefined,
          options,
          shapes: [],
        },
        resource: {
          format: resource.format,
          serialized: resource.serialized,
          prefixes: resource.prefixes,
          selectedResource: resource.selectedResource,
          resourcesToSelect: [],
          pointer: undefined,
          graph: undefined,
          quads: [],
        },
        rendererSettings: {
          ...state.rendererSettings,
        },
        componentsSettings: {
          ...state.componentsSettings,
        },
        playground: {
          ...state.playground,
        },
      }
    },
  })

  return () => {
    if (window.Shaperone?.DEBUG === true) {
      return devtools(store)
    }

    return store
  }
})()
