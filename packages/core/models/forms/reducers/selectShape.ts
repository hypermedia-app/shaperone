import { NodeShape } from '@rdfine/shacl'
import produce from 'immer'
import { BaseParams, formStateReducer } from '../../index.js'
import { FocusNode } from '../../../index.js'
import type { FormState } from '../index.js'

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
