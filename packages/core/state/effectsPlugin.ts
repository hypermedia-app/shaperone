/**
 * This is a modified version of the original effectsPlugin.ts file from the CaptainCodeman/rdx package,
 * which prevents event handlers from being attached multiple times to the same event type.
 *
 * It also adds a new method to the ModelStore interface, dispatchEvent, which allows for custom events to be dispatched.
 */

import type { ActionEvent, Dispatch, EffectFn, Model, Models, ModelsDispatch, ModelsState, Store, Plugin } from '@captaincodeman/rdx'
import { stateEvent } from '@captaincodeman/rdx'

declare module '@captaincodeman/rdx/typings/model.d.ts' {
  interface ModelStore {
    dispatchEvent: (event: CustomEvent) => boolean
  }
}

export interface ModelStore<M extends Models = Models> extends Store<ModelsState<M>> {
  dispatch: ModelsDispatch<M> & Dispatch
}

// const effects: { [type: string]: EffectFn[] } = {}
type Effects = { [type: string]: EffectFn[] }
// eslint-disable-next-line @typescript-eslint/ban-types
const inits: Function[] = []

export const actionType = (name: string, key: string) => (key.indexOf('/') > -1 ? key : `${name}/${key}`)

const createDispatcher = (store: ModelStore, name: string, key: string) => {
  const type = actionType(name, key)
  store.dispatch[name][key] = (payload?: any): any => {
    const action = { type, ...(payload !== undefined && { payload }) }
    return store.dispatch(action)
  }
}

export class EffectsPlugin implements Plugin {
  private readonly models: Map<Model, [string, string[], Effects]> = new Map()

  onModel(store: ModelStore, name: string, model: Model) {
    if (!model.effects) {
      return
    }

    if (!this.models.has(model)) {
      this.models.set(model, [name, [], {}])
    }
    const [, keys, effects] = this.models.get(model)!

    const modelEffects = model.effects({
      getDispatch: () => store.dispatch,
      getState: () => store.state,
      dispatchEvent: store.dispatchEvent.bind(store),
    })

    for (const key of Object.keys(modelEffects)) {
      keys.push(key)
      const type = actionType(name, key)
      const effect = modelEffects[key]

      // effects are a list, because multiple models may want to listen to the same
      // action type (e.g. routing/change) and we want to trigger _all_ of them ...
      if (effects[type]) {
        effects[type].push(effect)
      } else {
        effects[type] = [effect]
      }

      if (key === 'init') {
        inits.push(effect)
      }
    }
  }

  onStore(store: ModelStore) {
    const effects = [...this.models.values()].reduce<Effects>((acc, [name, keys, modelEffects]) => {
      keys.forEach(key => createDispatcher(store, name, key))

      return Object.keys(modelEffects)
        .reduce((acc, type) => {
          const effect = modelEffects[type]
          if (acc[type]) {
            acc[type].push(...effect)
          } else {
            acc[type] = effect
          }
          return acc
        }, acc)
    }, {})

    store.addEventListener(stateEvent, (e) => {
      const { action } = (<CustomEvent<ActionEvent>>e).detail
      const runEffects = effects[action.type!]

      if (runEffects) {
        // allow the triggering action to be reduced first
        // before we handle the effect(s) running
        queueMicrotask(() => runEffects.forEach(effect => effect(action.payload)))
      }
    })

    // allow other store decorators to 'wire up' before initialization
    queueMicrotask(() => inits.forEach(effect => effect()))
  }
}
