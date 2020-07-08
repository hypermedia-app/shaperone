import { SingleContextClownface } from 'clownface'
import { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../..'
import { formStateReducer } from './index'
import { matchEditors } from '../lib/stateBuilder'
import type { PropertyObjectState } from '../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import { defaultValue } from '../lib/defaultValue'

export interface Params {
  focusNode: FocusNode
  property: PropertyShape
  object?: SingleContextClownface
}

export const addObject = formStateReducer(({ state, editors }, { focusNode, property }: Params) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map((currentProperty) => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }
    const object = property.defaultValue ? focusNodeState.focusNode.node(property.defaultValue) : defaultValue(property, focusNodeState.focusNode)

    if (currentProperty.objects.find(o => o.object.term.equals(object.term))) {
      return currentProperty
    }

    const suitableEditors = matchEditors(property, object, editors)

    const newObject: PropertyObjectState = {
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
    }

    return {
      ...currentProperty,
      objects: [
        ...currentProperty.objects,
        newObject,
      ],
      canRemove: canRemoveObject(property, currentProperty.objects.length + 1),
      canAdd: canAddObject(property, currentProperty.objects.length + 1),
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
