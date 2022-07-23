import produce from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import type { FormState } from '../index'
import { BaseParams, formStateReducer } from '../../index.js'
import { FocusNode } from '../../../index'

export interface MultiEditorParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  editor?: Term
}

export const selectMultiEditor = formStateReducer((state: FormState, { focusNode, property, editor }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = propertyState.editors.find(({ term }) => term.equals(editor))?.term || propertyState.editors[0]?.term
    propertyState.componentState = {}
  }
}))

export const selectSingleEditors = formStateReducer((state: FormState, { focusNode, property }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = undefined
  }
}))
