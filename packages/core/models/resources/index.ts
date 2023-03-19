import { createModel } from '@captaincodeman/rdx'
import clownface, { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import type { Store } from '../../state'
import { setRoot } from './reducers/setRoot.js'
import formsEffects from './effects/forms/index.js'
import type { ChangeDetails } from './lib/notify'
import { createState } from './lib/state.js'
import type { FocusNode } from '../../index'

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

      return map.set(form, createState(clownface({ dataset: $rdf.dataset() }).namedNode('')))
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
