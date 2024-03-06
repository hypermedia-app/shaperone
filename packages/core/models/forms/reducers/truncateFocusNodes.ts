import produce from 'immer'
import { formStateReducer, BaseParams } from '../../index.js'
import { FocusNode } from '../../../index.js'
import type { FormState } from '../index.js'

export interface Params extends BaseParams {
  focusNode?: FocusNode
}

export const truncateFocusNodes = formStateReducer((state: FormState, { focusNode }: Params) => produce(state, (draft) => {
  if (!focusNode) {
    draft.focusNodes = {}
    draft.focusStack = []
    return
  }

  const topNodeIndex = draft.focusStack.findIndex(fn => fn.term.equals(focusNode.term))
  if (topNodeIndex >= 0) {
    draft.focusStack.splice(topNodeIndex)
    draft.focusStack = draft.focusStack.map(node => focusNode.node(node.term))
  }
}))
