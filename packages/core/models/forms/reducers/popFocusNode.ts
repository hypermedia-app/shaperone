import produce from 'immer'
import { formStateReducer } from './index'

export const popFocusNode = formStateReducer(({ state }) => produce(state, (state) => {
  const poppedFocusNode = state.focusStack.pop()
  if (poppedFocusNode) {
    delete state.focusNodes[poppedFocusNode.value]
  }
}))
