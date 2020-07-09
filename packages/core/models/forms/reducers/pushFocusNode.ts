import { PropertyShape, Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
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
      shape: property.get<Shape>(sh.node),
      shapes: state.shapes.filter(matchFor(focusNode)),
      editors,
      multiEditors,
    }),
  },
}))
