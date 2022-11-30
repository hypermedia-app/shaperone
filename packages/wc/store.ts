/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/store
 */

import { createStore, ModelStore, StoreDispatch, StoreState, devtools } from '@captaincodeman/rdx'
import { editors } from '@hydrofoil/shaperone-core/models/editors'
import { components } from '@hydrofoil/shaperone-core/models/components'
import { forms } from '@hydrofoil/shaperone-core/models/forms'
import { resources } from '@hydrofoil/shaperone-core/models/resources'
import { shapes } from '@hydrofoil/shaperone-core/models/shapes'
import { validation } from '@hydrofoil/shaperone-core/models/validation'
import { getPlugins } from '@hydrofoil/shaperone-core/store'
import { renderer } from './renderer/model'

declare global {
  interface Window {
    Shaperone: {
      DEBUG: boolean
    }
  }
}

window.Shaperone = { DEBUG: false }

const config = {
  models: {
    editors,
    renderer,
    forms,
    resources,
    shapes,
    components,
    validation,
  },
}

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

export const store = (() => {
  let debug = false
  let store: ReturnType<typeof createStore<typeof config>> | undefined

  return () => {
    if (!store) {
      store = createStore({
        ...config,
        plugins: getPlugins(),
      })
    }

    if (window.Shaperone?.DEBUG === true && !debug) {
      debug = true
      store = devtools(store)
    }

    return store
  }
})()
