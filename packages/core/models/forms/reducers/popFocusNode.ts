import { formStateReducer } from './index'

export const popFocusNode = formStateReducer(({ state }) => {
  if (state.focusStack.length === 0) {
    return state
  }

  const poppedFocusNode = state.focusStack[state.focusStack.length - 1]
  const focusNodes = { ...state.focusNodes }
  delete focusNodes[poppedFocusNode.value]

  return {
    ...state,
    focusStack: state.focusStack.slice(0, -1),
    focusNodes,
  }
})
