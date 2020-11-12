import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { BaseParams, formStateReducer } from '../../index'
import type { FocusNode } from '../../../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import type { FormState, PropertyObjectState } from '../index'

export interface RemoveObjectParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const removeObject = formStateReducer((state: FormState, { focusNode, property, object }: RemoveObjectParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  const objects = propertyState.objects.filter(o => o.key !== object.key)

  propertyState.objects = objects
  propertyState.canRemove = canRemoveObject(property, objects.length)
  propertyState.canAdd = canAddObject(property, objects.length)
}))
