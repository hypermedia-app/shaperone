import type { PropertyShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import type { FocusNode } from '../../../index'
import type { PropertyObjectState } from '../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import { getPathProperty } from '../../../lib/property'

export interface RemoveObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const removeObject = formStateReducer(({ state }, { focusNode, property, object }: RemoveObjectParams) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map((currentProperty) => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }

    const objects = currentProperty.objects.filter(o => !o.object.term.equals(object.object.term))

    focusNodeState.focusNode
      .deleteOut(getPathProperty(property).id)
      .addOut(getPathProperty(property).id, objects.map(o => o.object))

    return {
      ...currentProperty,
      objects,
      canRemove: canRemoveObject(property, objects.length),
      canAdd: canAddObject(property, objects.length),
    }
  })

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        properties,
      },
    },
  }
})
