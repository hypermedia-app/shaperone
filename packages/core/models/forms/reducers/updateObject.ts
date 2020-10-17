import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import type { PropertyObjectState } from '../index'
import type { FocusNode } from '../../../index'
import { matchEditors } from '../lib/stateBuilder'
import { getPathProperty } from '../../../lib/property'

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

export const updateObject = formStateReducer(({ state }, { focusNode, property, oldValue, newValue }: UpdateObjectParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))
  if (!propertyState) {
    return
  }

  const objectState = propertyState.objects.find(o => o.object.term.equals(oldValue))
  if (objectState) {
    objectState.object = focusNodeState.focusNode.node(newValue)
  }
  const pathProperty = getPathProperty(property).id
  focusNodeState.focusNode
    .deleteOut(pathProperty)
    .addOut(pathProperty, propertyState.objects.map(o => o.object.term))
}))

export const replaceObjects = formStateReducer(({ state, editors }, { focusNode, property, terms }: ReplaceObjectsParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  propertyState.objects = terms.map<PropertyObjectState>((term) => {
    const object = focusNode.node(term)
    const suitableEditors = matchEditors(property, object, editors)
    return {
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
    }
  })

  const pathProperty = getPathProperty(property).id
  focusNodeState.focusNode
    .deleteOut(pathProperty)
    .addOut(pathProperty, terms)
}))
