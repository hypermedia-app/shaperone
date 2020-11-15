import { createModel } from '@captaincodeman/rdx'
import clownface, { AnyPointer } from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import type { Store } from '../../state'
import { setRoot } from './reducers/setRoot'
import formsEffects from './effects/forms'
import { ChangeDetails, ChangeNotifier } from './lib/notify'

export interface ResourceState {
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
      map.set(form, {
        graph: clownface({ dataset: dataset() }).namedNode('').any(),
        changeNotifier: new ChangeNotifier(),
      })

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
