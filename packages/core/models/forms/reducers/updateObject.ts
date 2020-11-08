import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import type { PropertyObjectState } from '../index'
import type { FocusNode } from '../../../index'
import { matchEditors } from '../lib/stateBuilder'

export interface UpdateObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  oldValue: Term | undefined
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

  if (newValue.equals(oldValue)) {
    return
  }

  const objectState = propertyState.objects.find(o => o.object.equals(oldValue))
  if (objectState) {
    objectState.object = newValue
  }
}))

export const replaceObjects = formStateReducer(({ state }, { focusNode, property, terms }: ReplaceObjectsParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  propertyState.objects = terms.map<PropertyObjectState>((object) => {
    const suitableEditors = matchEditors(property, object, editors)
    return {
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
    }
  })
}))
