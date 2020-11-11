import { NamedNode, Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface SelectEditorParams {
  focusNode: FocusNode
  property: PropertyShape
  value?: Term
  editor: NamedNode
}

export const selectEditor = formStateReducer(({ state }, { focusNode, property, value, editor }: SelectEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  const object = propertyState.objects.find(o => o.object?.term.equals(value))
  if (object) {
    object.selectedEditor = editor
  }
}))
