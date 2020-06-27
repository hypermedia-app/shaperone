import { NodeShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = formStateReducer(({ state, editors }, { focusNode, shape }: Params) => {
  const focusNodes = { ...state.focusNodes }
  const current = focusNodes[focusNode.value]
  focusNodes[focusNode.value] = initialiseFocusNode({
    shape,
    shapes: current.shapes,
    editors,
    focusNode,
  })

  return {
    ...state,
    focusNodes,
  }
})
