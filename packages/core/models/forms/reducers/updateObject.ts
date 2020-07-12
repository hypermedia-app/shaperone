import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import type { PropertyObjectState } from '../index'
import type { FocusNode } from '../../../index'
import { matchEditors } from '../lib/stateBuilder'

export interface UpdateObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  oldValue: Term
  newValue: Term
}

export interface ReplaceObjectsParams {
  focusNode: FocusNode
  property: PropertyShape
  terms: Term[]
}

export const updateObject = formStateReducer(({ state }, { focusNode, property, oldValue, newValue }: UpdateObjectParams) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const properties = focusNodeState.properties.map((prop) => {
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

export const replaceObjects = formStateReducer(({ state, editors }, { focusNode, property, terms }: ReplaceObjectsParams) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map((prop) => {
    if (!prop.shape.id.equals(property.id)) {
      return prop
    }

    const objects = terms.map<PropertyObjectState>((term) => {
      const object = focusNode.node(term)
      const suitableEditors = matchEditors(property, object, editors)
      return {
        object,
        editors: suitableEditors,
        selectedEditor: suitableEditors[0]?.term,
      }
    })

    focusNodeState.focusNode
      .deleteOut(property.path.id)
      .addOut(property.path.id, terms)

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
