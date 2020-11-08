import produce from 'immer'
import { BaseParams, formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
}

export const setProperties = formStateReducer(({ state }, { focusNode }: Params) => produce(state, (draft) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  if (focusNodeState) {
    // focusNodeState.
  }
}))
