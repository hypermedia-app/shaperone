import { Term } from 'rdf-js'
import { formStateReducer } from './index'
import { PropertyShape } from '@rdfine/shacl'
import { PropertyObjectState } from '../index'
import { FocusNode } from '../../../index'

export interface UpdateObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  oldValue: Term
  newValue: Term
}

export const updateObject = formStateReducer(function ({ state }, { focusNode, property, oldValue, newValue }: UpdateObjectParams) {
  const focusNodeState = state.focusNodes[focusNode.value]
  const properties = focusNodeState.properties.map(prop => {
    if (!prop.shape.id.equals(property.id)) {
      return prop
    }

    const objects = prop.objects.map((o): PropertyObjectState => {
      if (o.object.term.equals(oldValue)) {
        return {
          ...o,
          object: focusNodeState.focusNode.node(newValue),
        }
      }

      return o
    })

    focusNodeState.focusNode
      .deleteOut(property.path.id)
      .addOut(property.path.id, objects.map(o => o.object))

    return {
      ...prop,
      objects,
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
