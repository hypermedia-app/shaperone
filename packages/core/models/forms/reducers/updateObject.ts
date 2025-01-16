import type { Term } from '@rdfjs/types'
import type { PropertyShape } from '@rdfine/shacl'
import { produce } from 'immer'
import type { GraphPointer, MultiPointer } from 'clownface'
import { dash } from '@tpluscode/rdf-ns-builders'
import graphPointer from 'is-graph-pointer'
import type { PropertyObjectState, State } from '../index.js'
import type { FocusNode } from '../../../index.js'
import type { EditorsState } from '../../editors/index.js'
import { nextid } from '../lib/objectid.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import { objectStateProducer } from '../objectStateProducer.js'

export interface SetObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
  newValue: Term | GraphPointer
}

export interface ReplaceObjectsParams {
  focusNode: FocusNode
  property: PropertyShape
  objects: MultiPointer
  editors: EditorsState
}

export const setObjectValue = objectStateProducer<SetObjectParams>((draft, { focusNode, object, newValue }, propertyState) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  const objectState = propertyState.objects.find(o => o.key === object.key)
  if (objectState) {
    objectState.object = focusNodeState.focusNode.node(newValue)
  }
})

export const setPropertyObjects = objectStateProducer<ReplaceObjectsParams>((draft, { property, objects, editors }, propertyState) => {
  propertyState.canAdd = canAddObject(property, objects.terms.length)
  propertyState.canRemove = canRemoveObject(property, objects.terms.length)
  propertyState.objects = objects.map<PropertyObjectState>((object) => {
    const suitableEditors = editors.matchSingleEditors({ shape: property, object })
    return {
      key: nextid(),
      object,
      editors: suitableEditors,
      selectedEditor: suitableEditors[0]?.term,
      validationResults: [],
      hasErrors: false,
      nodeKind: undefined,
      overrides: undefined,
    }
  })
})

export interface InitObjectValueParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
  value: GraphPointer
  editors: EditorsState
}

export const initObjectValue = objectStateProducer<InitObjectValueParams>((draft, { property, object, value, editors }, propertyState) => {
  const objectState = propertyState?.objects.find(o => o.key === object.key)
  if (!objectState) {
    return
  }

  const suitableEditors = editors.matchSingleEditors({ shape: property, object: value })
  objectState.editors = suitableEditors
  objectState.selectedEditor = suitableEditors[0]?.term
  objectState.object = value
})

export interface SetDefaultValueParams {
  focusNode: FocusNode
  property: PropertyShape
  value: GraphPointer
  editors: EditorsState
}

export const setDefaultValue = objectStateProducer<SetDefaultValueParams>((draft, { focusNode, property, value, editors }) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const objects = focusNodeState.properties.find(p => p.shape.equals(property))?.objects || []

  for (const objectState of objects) {
    if (!objectState.object) {
      objectState.object = value

      const editorOverride = objectState.overrides?.out(dash.editor)
      if (graphPointer.isNamedNode(editorOverride)) {
        objectState.selectedEditor = editors.metadata.node(editorOverride).term
      } else {
        const suitableEditors = editors.matchSingleEditors({ shape: property, object: value })
        objectState.selectedEditor = suitableEditors[0]?.term
      }
    }
  }
})

export interface ClearValueParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const clearValue = objectStateProducer<ClearValueParams>((draft, { object }, propertyState) => {
  const objectState = propertyState?.objects.find(o => o.key === object.key)
  if (objectState) {
    objectState.object = undefined
  }
})
