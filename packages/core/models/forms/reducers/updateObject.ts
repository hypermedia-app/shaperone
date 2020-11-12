import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { MultiPointer } from 'clownface'
import { BaseParams, formStateReducer } from '../../index'
import type { FormState, PropertyObjectState } from '../index'
import type { FocusNode } from '../../../index'
import { EditorsState } from '../../editors'

export interface UpdateObjectParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  oldValue?: Term
  newValue: Term
}

export interface ReplaceObjectsParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  objects: MultiPointer
  editors: EditorsState
}

export const updateObject = formStateReducer((state: FormState, { focusNode, property, oldValue, newValue }: UpdateObjectParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))
  if (!propertyState) {
    return
  }

  const objectState = propertyState.objects.find(o => o.object?.term.equals(oldValue))
  if (objectState) {
    objectState.object = focusNodeState.focusNode.node(newValue)
  }
}))

export const setPropertyObjects = formStateReducer((state: FormState, { focusNode, property, objects, editors }: ReplaceObjectsParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  propertyState.objects = objects.map<PropertyObjectState>((object) => {
    const suitableEditors = editors.matchSingleEditors({ shape: property, object })
    return {
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
    }
  })
}))
