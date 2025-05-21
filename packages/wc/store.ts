/**
 * @packageDocumentation
 * @module shaperone/store
 */

import type { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { editors } from '@shaperone/core/models/editors/index.js'
import { components } from '@shaperone/core/models/components/index.js'
import { form } from '@shaperone/core/models/forms/index.js'
import { resources } from '@shaperone/core/models/resources/index.js'
import { shapes } from '@shaperone/core/models/shapes/index.js'
import { validation } from '@shaperone/core/models/validation/index.js'
import { getPlugins, createStore, devtools } from '@shaperone/core/store.js'
import type { LitElement } from '@open-wc/scoped-elements/lit-element.js'
import { renderer } from './renderer/model.js'

declare module '@shaperone/core/models/components/index.js' {
  interface ComponentConstructor extends CustomElementConstructor { }

  interface SingleEditorComponent extends LitElement {}
}

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
