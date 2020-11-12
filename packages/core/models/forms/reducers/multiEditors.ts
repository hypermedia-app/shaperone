import produce from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import type { FormState } from '../index'
import { BaseParams, formStateReducer } from '../../index'
import { FocusNode } from '../../../index'

export interface MultiEditorParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
}

export const selectMultiEditor = formStateReducer((state: FormState, { focusNode, property }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = propertyState.editors[0]?.term
  }
}))

export const selectSingleEditors = formStateReducer((state: FormState, { focusNode, property }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = undefined
  }
}))
