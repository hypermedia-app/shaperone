import produce from 'immer'
import { PropertyShape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import { BaseParams, formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: string
  value: Term
}

export const setObjectValue = formStateReducer(({ state }, { focusNode, property, object, value }: Params) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value].properties.find(p => p.shape.equals(property))
  const objState = propertyState?.objects.find(o => o.key === object)

  if (objState) {
    objState.object = value
  }
}))
