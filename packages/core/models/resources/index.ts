import { createModel } from '@captaincodeman/rdx'
import type { AnyPointer } from 'clownface'
import type { Store } from '../../state/index.js'
import { setRoot } from './reducers/setRoot.js'
import formsEffects from './effects/forms/index.js'
import type { FocusNode } from '../../index.js'

export interface ResourceState {
  rootPointer?: FocusNode
  graph?: AnyPointer
}

export type State = ResourceState

export const resources = createModel({
  state: <ResourceState> {},
  reducers: {
    setRoot,
  },
  effects(store: Store) {
    return {
      ...formsEffects(store),
    }
  },
})
