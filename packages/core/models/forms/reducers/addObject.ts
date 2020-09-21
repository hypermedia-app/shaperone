import { GraphPointer } from 'clownface'
import { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../..'
import { formStateReducer } from './index'
import { matchEditors } from '../lib/stateBuilder'
import type { PropertyObjectState } from '../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import { defaultValue } from '../lib/defaultValue'
import { getPathProperty } from '../../../lib/property'

export interface Params {
  focusNode: FocusNode
  property: PropertyShape
  object?: GraphPointer
}

export const addObject = formStateReducer(({ state, editors }, { focusNode, property }: Params) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map((currentProperty) => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }
    let object: GraphPointer
    if (property.defaultValue) {
      object = focusNodeState.focusNode.node(property.defaultValue)
    } else {
      object = defaultValue(property, focusNodeState.focusNode)
    }
    focusNode.addOut(getPathProperty(property).id, object)

    if (currentProperty.objects.find(o => o.object.term.equals(object.term))) {
      return currentProperty
    }

    const suitableEditors = matchEditors(property, object, editors)

    const newObject: PropertyObjectState = {
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
    }

    const canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length + 1)
    const canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length + 1)

    return {
      ...currentProperty,
      objects: [
        ...currentProperty.objects,
        newObject,
      ],
      canRemove,
      canAdd,
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
