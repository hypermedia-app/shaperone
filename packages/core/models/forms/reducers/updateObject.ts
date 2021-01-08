import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { GraphPointer, MultiPointer } from 'clownface'
import { BaseParams, formStateReducer } from '../../index'
import type { FormState, PropertyObjectState, State } from '../index'
import type { FocusNode } from '../../../index'
import { EditorsState } from '../../editors'
import { nextid } from '../lib/objectid'
import { canAddObject, canRemoveObject } from '../lib/property'

export interface UpdateObjectParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
  newValue: Term
}

export interface ReplaceObjectsParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  objects: MultiPointer
  editors: EditorsState
}

export const updateObject = formStateReducer((state: FormState, { focusNode, property, object, newValue }: UpdateObjectParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))
  if (!propertyState) {
    return
  }

  const objectState = propertyState.objects.find(o => o.key === object.key)
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

  propertyState.canAdd = canAddObject(property, objects.terms.length)
  propertyState.canRemove = canRemoveObject(property, objects.terms.length)
  propertyState.objects = objects.map<PropertyObjectState>((object) => {
    const suitableEditors = editors.matchSingleEditors({ shape: property, object })
    return {
      key: nextid(),
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
      componentState: {},
    }
  })
}))

export interface SetObjectValueParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
  value: GraphPointer
  editors: EditorsState
}

export const setObjectValue = formStateReducer((state: FormState, { focusNode, property, object, value, editors }: SetObjectValueParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  const objectState = propertyState?.objects.find(o => o.key === object.key)
  if (!objectState) {
    return
  }

  const suitableEditors = editors.matchSingleEditors({ shape: property, object: value })
  objectState.editors = suitableEditors
  objectState.selectedEditor = suitableEditors[0]?.term
  objectState.object = value
}))

export interface SetDefaultValueParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  value: GraphPointer
  editors: EditorsState
}

export const setDefaultValue = formStateReducer((state: FormState, { focusNode, property, value, editors }: SetDefaultValueParams) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const objects = focusNodeState.properties.find(p => p.shape.equals(property))?.objects || []

  for (const objectState of objects) {
    if (!objectState.object) {
      const suitableEditors = editors.matchSingleEditors({ shape: property, object: value })

      objectState.object = value
      objectState.selectedEditor = suitableEditors[0]?.term
    }
  }
}))

export const resetComponents = (state: State) => {
  for (const [form, formState] of state.entries()) {
    const newState = produce(formState, (draft: typeof formState) => {
      for (const focusNode of Object.values(draft.focusNodes)) {
        for (const property of focusNode.properties) {
          for (const object of property.objects) {
            object.componentState = {}
          }
        }
      }
    })
    state.set(form, newState)
  }

  return state
}
