import produce from 'immer'
import type { FormState } from '../index.js'
import { formStateReducer } from '../../index.js'

export const popFocusNode = formStateReducer((state: FormState) => produce(state, (state) => {
  const poppedFocusNode = state.focusStack.pop()
  if (poppedFocusNode) {
    delete state.focusNodes[poppedFocusNode.value]
  }
}))
