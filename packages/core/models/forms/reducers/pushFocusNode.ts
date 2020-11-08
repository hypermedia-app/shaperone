import { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export const pushFocusNode = formStateReducer(({ state }, { focusNode, property }: { focusNode: FocusNode; property: PropertyShape }) => produce(state, (draft) => {
  draft.focusStack.push(focusNode)
  draft.focusNodes[focusNode.value] = initialiseFocusNode({
    focusNode,
    shape: property.node,
    shapes: [], // state.shapes.filter(matchFor(focusNode)),
    shouldEnableEditorChoice: state.shouldEnableEditorChoice,
  }, state.focusNodes[focusNode.value])
}))
