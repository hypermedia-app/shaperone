import type { Term } from 'rdf-js'
import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { GraphPointer, MultiPointer } from 'clownface'
import { BaseParams, formStateReducer } from '../../index'
import type { PropertyObjectState, State } from '../index'
import type { FocusNode } from '../../../index'
import { EditorsState } from '../../editors'
import { nextid } from '../lib/objectid'
import { canAddObject, canRemoveObject } from '../lib/property'
import { objectStateProducer } from '../objectStateProducer'

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

export const updateObject = formStateReducer(objectStateProducer<UpdateObjectParams>((draft, { focusNode, object, newValue }, propertyState) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  const objectState = propertyState.objects.find(o => o.key === object.key)
  if (objectState) {
    objectState.object = focusNodeState.focusNode.node(newValue)
  }
}))

export const setPropertyObjects = formStateReducer(objectStateProducer<ReplaceObjectsParams>((draft, { property, objects, editors }, propertyState) => {
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
      validationResults: [],
      hasErrors: false,
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

export const setObjectValue = formStateReducer(objectStateProducer<SetObjectValueParams>((draft, { property, object, value, editors }, propertyState) => {
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

export const setDefaultValue = formStateReducer(objectStateProducer<SetDefaultValueParams>((draft, { focusNode, property, value, editors }) => {
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

export interface ClearValueParams extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const clearValue = formStateReducer(objectStateProducer<ClearValueParams>((draft, { object }, propertyState) => {
  const objectState = propertyState?.objects.find(o => o.key === object.key)
  if (objectState) {
    objectState.object = undefined
  }
}))
