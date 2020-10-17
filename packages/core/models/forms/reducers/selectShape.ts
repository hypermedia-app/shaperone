import { NodeShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = formStateReducer(({ state, editors, multiEditors }, { focusNode, shape }: Params) => produce(state, (draft) => {
  const current = draft.focusNodes[focusNode.value]
  if (!current || current.shape?.equals(shape)) {
    return
  }

  draft.focusNodes[focusNode.value] = initialiseFocusNode({
    shape,
    shapes: current.shapes as any,
    editors,
    multiEditors,
    focusNode,
    shouldEnableEditorChoice: state.shouldEnableEditorChoice,
  }, state.focusNodes[focusNode.value])
}))
