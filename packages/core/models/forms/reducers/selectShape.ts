import { NodeShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'
import { initialisePropertyShapes } from '../lib/stateBuilder'
import { BaseParams } from '../..'

export interface Params extends BaseParams {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = formStateReducer(({ state }, { focusNode, shape }: Params) => produce(state, (draft) => {
  const current = draft.focusNodes[focusNode.value]
  if (!current || current.shape?.equals(shape)) {
    return
  }

  draft.focusNodes[focusNode.value].shape = shape

  draft.focusNodes[focusNode.value] = {
    ...draft.focusNodes[focusNode.value],
    ...initialisePropertyShapes(shape, {
      focusNode,
      shouldEnableEditorChoice: state.shouldEnableEditorChoice,
    }, undefined),
  }
}))
