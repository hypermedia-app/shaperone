import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export const truncateFocusNodes = formStateReducer(({ state }, { focusNode }: { focusNode?: FocusNode }) => produce(state, (draft) => {
  if (!focusNode) {
    draft.focusNodes = {}
    draft.focusStack = []
    return
  }

  const topNodeIndex = draft.focusStack.findIndex(fn => fn.term.equals(focusNode.term))
  if (topNodeIndex >= 0) {
    draft.focusStack.splice(topNodeIndex, 1)
  }
}))
