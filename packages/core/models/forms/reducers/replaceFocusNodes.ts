import { produce } from 'immer'
import type { FocusNodeState, FormState } from '../index.js'

type StackAction = {appendToStack?: true} | {replaceStack?: true}

export type Params = { focusNode: FocusNodeState } & StackAction

export const replaceFocusNodeState = (state: FormState, { focusNode, ...rest }: Params) => produce(state, (draft) => {
  if ('appendToStack' in rest && rest.appendToStack) {
    draft.focusStack.push(focusNode.focusNode)
  }

  if ('replaceStack' in rest && rest.replaceStack) {
    draft.focusStack = [focusNode.focusNode]
  }

  draft.focusStack = draft.focusStack.map(node => (node.term.equals(focusNode.focusNode.term) ? focusNode.focusNode : node))
  draft.focusNodes[focusNode.focusNode.value] = focusNode
})
