import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { matchFor } from '../lib/shapes'

export const pushFocusNode = formStateReducer(({ state, editors }, { focusNode }: { focusNode: FocusNode }) => ({
  ...state,
  focusStack: [...state.focusStack, focusNode],
  focusNodes: {
    ...state.focusNodes,
    [focusNode.value]: initialiseFocusNode({
      focusNode,
      shapes: state.shapes.filter(matchFor(focusNode)),
      editors,
    }),
  },
}))
