import produce from 'immer'
import { formStateReducer } from './index'
import { initialiseFocusNode } from '../lib/stateBuilder'

type StackAction = {appendToStack?: true} | {replaceStack?: true}

type Params = Parameters<typeof initialiseFocusNode>[0] & StackAction

export const createFocusNodeState = formStateReducer<Params>(({ state }, { focusNode, ...rest }) => produce(state, (draft) => {
  draft.focusNodes[focusNode.value] = initialiseFocusNode({
    focusNode,
    ...rest,
  }, state.focusNodes[focusNode.value])

  if ('appendToStack' in rest && rest.appendToStack) {
    draft.focusStack.push(focusNode)
  }

  if ('replaceStack' in rest && rest.replaceStack) {
    draft.focusStack = [focusNode]
  }
}))
