import produce from 'immer'
import { BaseParams, formStateReducer } from '../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import type { FormState } from '../index'

type StackAction = {appendToStack?: true} | {replaceStack?: true}

export type Params = Parameters<typeof initialiseFocusNode>[0] & StackAction & BaseParams

export const createFocusNodeState = formStateReducer((state: FormState, { focusNode, ...rest }: Params) => produce(state, (draft) => {
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
