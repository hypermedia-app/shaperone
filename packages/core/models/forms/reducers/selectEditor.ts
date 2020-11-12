import { NamedNode, Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { BaseParams, formStateReducer } from '../../index'
import { FocusNode } from '../../../index'
import type { FormState } from '../index'

export interface SelectEditorParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  value?: Term
  editor: NamedNode
}

export const selectEditor = formStateReducer((state: FormState, { focusNode, property, value, editor }: SelectEditorParams) => produce(state, (state) => {
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
