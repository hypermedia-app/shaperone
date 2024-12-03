/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/store
 */

import type { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { createStore, devtools } from '@captaincodeman/rdx'
import { editors } from '@hydrofoil/shaperone-core/models/editors/index.js'
import { components } from '@hydrofoil/shaperone-core/models/components/index.js'
import { form } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { resources } from '@hydrofoil/shaperone-core/models/resources/index.js'
import { shapes } from '@hydrofoil/shaperone-core/models/shapes/index.js'
import { validation } from '@hydrofoil/shaperone-core/models/validation/index.js'
import { getPlugins } from '@hydrofoil/shaperone-core/store.js'
import { renderer } from './renderer/model.js'

const config = {
  models: {
    editors,
    renderer,
    form,
    resources,
    shapes,
    components,
    validation,
  },
}

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

const rootStore = store(true)

export default rootStore

export function store(rootState = false): ReturnType<typeof createStore<typeof config>> {
  const state = !rootState ? rootStore?.state : undefined
  const plugins = getPlugins()

  return createStore({
    ...config,
    plugins,
    state,
  })
}

export function debug(store: ReturnType<typeof createStore<typeof config>>) {
  return devtools(store)
}
