import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import type { FocusNode } from '../../../index'
import type { PropertyObjectState } from '../index'
import { canAddObject, canRemoveObject } from '../lib/property'

export interface RemoveObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const removeObject = formStateReducer(({ state }, { focusNode, property, object }: RemoveObjectParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  const objects = propertyState.objects.filter(o => o.key !== object.key)

  propertyState.objects = objects
  propertyState.canRemove = canRemoveObject(property, objects.length)
  propertyState.canAdd = canAddObject(property, objects.length)
}))
