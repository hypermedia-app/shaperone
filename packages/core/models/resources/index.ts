import { createModel } from '@captaincodeman/rdx'
import type { AnyPointer } from 'clownface'
import type { Store } from '../../state/index.js'
import { setRoot } from './reducers/setRoot.js'
import formsEffects from './effects/forms/index.js'
import type { ChangeDetails } from './lib/notify.js'
import { createState } from './lib/state.js'
import type { FocusNode } from '../../index.js'
import env from '../../env.js'

export interface ResourceState {
  rootPointer: FocusNode
  graph: AnyPointer
  changeNotifier: {
    notify(detail: ChangeDetails): void
    onChange(listener: (detail: ChangeDetails) => void): void
  }
}

export type State = Map<symbol, ResourceState>

export const resources = createModel({
  state: new Map() as State,
  reducers: {
    connect(map: State, form: symbol) {
      if (map.has(form)) {
        return map
      }

      return map.set(form, createState(env().clownface().namedNode('')))
    },
    disconnect(map: State, form: symbol) {
      map.delete(form)
      return map
    },
    setRoot,
  },
  effects(store: Store) {
    return {
      ...formsEffects(store),
    }
  },
})
