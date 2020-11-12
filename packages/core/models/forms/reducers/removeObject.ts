import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { GraphPointer } from 'clownface'
import { BaseParams, formStateReducer } from './index'
import type { FocusNode } from '../../../index'
import { canAddObject, canRemoveObject } from '../lib/property'

export interface RemoveObjectParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: GraphPointer
}

export const removeObject = formStateReducer(({ state }, { focusNode, property, object }: RemoveObjectParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  const objects = propertyState.objects.filter(o => !o.object?.term.equals(object?.term))

  propertyState.objects = objects
  propertyState.canRemove = canRemoveObject(property, objects.length)
  propertyState.canAdd = canAddObject(property, objects.length)
}))
