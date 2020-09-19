import { NodeShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = formStateReducer(({ state, editors, multiEditors }, { focusNode, shape }: Params) => {
  const current = state.focusNodes[focusNode.value]
  if (!current || current.shape?.id.equals(shape.id)) {
    return state
  }

  const focusNodes = { ...state.focusNodes }
  focusNodes[focusNode.value] = initialiseFocusNode({
    shape,
    shapes: current.shapes,
    editors,
    multiEditors,
    focusNode,
  }, state.focusNodes[focusNode.value])

  return {
    ...state,
    focusNodes,
  }
})
