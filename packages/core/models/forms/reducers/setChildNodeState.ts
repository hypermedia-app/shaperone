import { produce } from 'immer'
import type { Term } from '@rdfjs/types'
import type { FocusNodeState, FormState } from '../index.js'
import type { FocusNode } from '../../../index.js'

export interface Params {
  propertyShape: Term
  focusNode: FocusNode
  state: FocusNodeState
}

export const setChildNodeState = (state: FormState, { propertyShape, focusNode, ...arg }: Params) => produce(state, (draft) => {
  draft.detailNodes[`${propertyShape.value}/${focusNode.value}`] = arg.state
})
