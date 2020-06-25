import { sh } from '@tpluscode/rdf-ns-builders'
import { formStateReducer } from './index'
import { PropertyShape } from '@rdfine/shacl'
import { FocusNode } from '../../../index'
import { PropertyObjectState } from '../index'

export interface RemoveObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const removeObject = formStateReducer(({ state }, { focusNode, property, object }: RemoveObjectParams) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map(currentProperty => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }

    const objects = currentProperty.objects.filter(o => !o.object.term.equals(object.object.term))

    focusNodeState.focusNode
      .deleteOut(property.path.id)
      .addOut(property.path.id, objects.map(o => o.object))

    const maxReached = (property.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= objects.length

    return {
      ...currentProperty,
      objects,
      maxReached,
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
