import { produce } from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import type { Term } from '@rdfjs/types'
import type { FormState } from '../index.js'
import type { FocusNode } from '../../../index.js'

export interface MultiEditorParams {
  focusNode: FocusNode
  property: PropertyShape
  editor?: Term
}

export const selectMultiEditor = (state: FormState, { focusNode, property, editor }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = propertyState.editors.find(({ term }) => term.equals(editor))?.term || propertyState.editors[0]?.term
    propertyState.componentState = {}
  }
})

export const selectSingleEditors = (state: FormState, { focusNode, property }: MultiEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (propertyState) {
    propertyState.selectedEditor = undefined
  }
})
