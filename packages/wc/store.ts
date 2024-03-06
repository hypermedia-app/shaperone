/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/store
 */

import { createStore, ModelStore, StoreDispatch, StoreState, devtools } from '@captaincodeman/rdx'
import { env } from '@hydrofoil/shaperone-core/models/rdfEnv/index.js'
import { editors } from '@hydrofoil/shaperone-core/models/editors/index.js'
import { components } from '@hydrofoil/shaperone-core/models/components/index.js'
import { forms } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { resources } from '@hydrofoil/shaperone-core/models/resources/index.js'
import { shapes } from '@hydrofoil/shaperone-core/models/shapes/index.js'
import { validation } from '@hydrofoil/shaperone-core/models/validation/index.js'
import { getPlugins } from '@hydrofoil/shaperone-core/store.js'
import { renderer } from './renderer/model.js'

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
    env,
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
