import type { NodeShape } from '@rdfine/shacl'
import { produce } from 'immer'
import type { FocusNode } from '../../../index.js'
import type { FormState } from '../index.js'

export interface Params {
  focusNode: FocusNode
  shape: NodeShape
}

export const selectShape = (state: FormState, { focusNode, shape }: Params) => produce(state, (draft) => {
  const current = draft.focusNodes[focusNode.value]
  if (!current || current.shape?.equals(shape)) {
    return
  }

  draft.focusNodes[focusNode.value].shape = shape
})
