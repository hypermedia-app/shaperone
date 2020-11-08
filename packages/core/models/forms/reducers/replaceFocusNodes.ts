import produce from 'immer'
import { BaseParams, formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
  label: string
}

export const replaceFocusNodes = formStateReducer(({ state }, { focusNode, label }: Params) => produce(state, (draft) => {
  draft.focusStack = [focusNode]
  draft.focusNodes = {
    [focusNode.value]: {
      focusNode,
      groups: [],
      label,
      shapes: [],
      properties: [],
    },
  }
}))
