import { NodeShape } from '@rdfine/shacl'
import produce from 'immer'
import { BaseParams, formStateReducer } from '../../index'
import { FocusNode } from '../../../index'
import type { FormState } from '../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = formStateReducer((state: FormState, { focusNode, shape }: Params) => produce(state, (draft) => {
  const current = draft.focusNodes[focusNode.value]
  if (!current || current.shape?.equals(shape)) {
    return
  }

  draft.focusNodes[focusNode.value].shape = shape
}))
