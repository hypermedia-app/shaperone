import { SingleContextClownface } from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import { PropertyShape } from '@rdfine/shacl'
import type { FocusNode } from '../../..'
import { formStateReducer } from './index'
import { matchEditors } from '../lib/stateBuilder'
import type { PropertyObjectState } from '../index'

export interface Params {
  focusNode: FocusNode
  property: PropertyShape
  object?: SingleContextClownface
}

function defaultValueNode(property: PropertyShape, focusNode: FocusNode): SingleContextClownface {
  if (property.get(sh.class) || property.get(sh.nodeKind)?.id.equals(sh.IRI)) {
    const resourceNode = focusNode.blankNode()
    const propertyClass = property.get(sh.class)
    if (propertyClass) {
      resourceNode.addOut(rdf.type, propertyClass.id)
    }

    return resourceNode
  }

  return focusNode.literal('')
}

export const addObject = formStateReducer(({ state, editors }, { focusNode, property }: Params) => {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map((currentProperty) => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }
    const object = property.defaultValue ? focusNodeState.focusNode.node(property.defaultValue) : defaultValueNode(property, focusNodeState.focusNode)

    if (currentProperty.objects.find(o => o.object.term.equals(object.term))) {
      return currentProperty
    }

    const suitableEditors = matchEditors(property, object, editors)

    const maxReached = (property.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= currentProperty.objects.length + 1
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
