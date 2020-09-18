import { PropertyShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { matchFor } from '../lib/shapes'

export const pushFocusNode = formStateReducer(({ state, editors, multiEditors }, { focusNode, property }: { focusNode: FocusNode; property: PropertyShape }) => ({
  ...state,
  focusStack: [...state.focusStack, focusNode],
  focusNodes: {
    ...state.focusNodes,
    [focusNode.value]: initialiseFocusNode({
      focusNode,
      shape: property.node,
      shapes: state.shapes.filter(matchFor(focusNode)),
      editors,
      multiEditors,
    }),
  },
}))
