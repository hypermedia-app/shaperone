import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export const truncateFocusNodes = formStateReducer(({ state }, { focusNode }: { focusNode?: FocusNode }) => {
  if (!focusNode) {
    return {
      ...state,
      focusStack: [],
      focusNodes: {},
    }
  }

  const topNodeIndex = state.focusStack.findIndex(fn => fn.term.equals(focusNode.term))
  if (topNodeIndex < 0) {
    return state
  }

  return {
    ...state,
    focusStack: state.focusStack.slice(0, topNodeIndex),
  }
})
