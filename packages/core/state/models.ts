import { createModel } from '@captaincodeman/rdx'
import * as DashMatcher from '../DashMatcher'
import * as reducers from './reducers'
import { Store } from '../state'
import { effects } from './effects'

export const form = createModel({
  state: {
    matchers: [DashMatcher],
    editors: {},
    focusNodes: {},
  },
  reducers,
  effects: (store: Store) => effects(store.dispatch()),
})
