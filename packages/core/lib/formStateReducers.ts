import { FormState, PropertyObjectState, PropertyState } from './FormState'
import { Shape } from '@rdfine/shacl'
import * as ns from '@tpluscode/rdf-ns-builders'
import { dash, FocusNode } from '../index'
import { initialiseFocusNode } from './stateBuilder'
import { sh } from '@tpluscode/rdf-ns-builders'
import {NamedNode, Term} from 'rdf-js'

interface BaseParams {
  focusNode: FocusNode
  property: PropertyState
}

interface SelectEditorParams extends BaseParams {
  value: Term
  editor: NamedNode
}

export function selectEditor(state: FormState, { focusNode, property, value, editor }: SelectEditorParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]
  const currentGroup = focusNodeState.groups[property.shape.group?.id.value]
  const currentProperty = currentGroup.properties[property.shape.path.id.value]
  const objects = currentProperty.objects.map(o => {
    if (o.object.term.equals(value)) {
      return {
        ...o,
        selectedEditor: editor,
      }
    }

    return o
  })

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        groups: {
          ...focusNodeState.groups,
          [property.shape.group?.id.value]: {
            ...currentGroup,
            properties: {
              ...currentGroup.properties,
              [property.shape.path.id.value]: {
                ...currentProperty,
                objects,
              },
            },
          },
        },
      },
    },
  }
}

interface UpdateObjectParams extends BaseParams {
  oldValue: Term
  newValue: Term
}

export function updateObject(state: FormState, { focusNode, property, oldValue, newValue }: UpdateObjectParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]
  const currentGroup = focusNodeState.groups[property.shape.group?.id.value]
  const currentProperty = currentGroup.properties[property.shape.path.id.value]
  const objects = currentProperty.objects.map((o): PropertyObjectState => {
    if (o.object.term.equals(oldValue)) {
      return {
        ...o,
        object: focusNodeState.focusNode.node(newValue),
      }
    }

    return o
  })

  focusNodeState.focusNode
    .deleteOut(property.shape.path.id)
    .addOut(property.shape.path.id, objects.map(o => o.object))

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        groups: {
          ...focusNodeState.groups,
          [property.shape.group?.id.value]: {
            ...currentGroup,
            properties: {
              ...currentGroup.properties,
              [property.shape.path.id.value]: {
                ...currentProperty,
                objects,
              },
            },
          },
        },
      },
    },
  }
}

export function addObject(state: FormState, { focusNode, property }: BaseParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]
  const currentGroup = focusNodeState.groups[property.shape.group?.id.value]
  const currentProperty = currentGroup.properties[property.shape.path.id.value]
  const object = property.shape.defaultValue ? focusNodeState.focusNode.node(property.shape.defaultValue) : focusNodeState.focusNode.literal('')

  if (currentProperty.objects.some(o => o.object.term.equals(object.term))) {
    return state
  }

  focusNodeState.focusNode.addOut(property.shape.path.id, object)

  const newObject: PropertyObjectState = {
    object,
    editors: [],
    selectedEditor: dash.TextFieldEditor,
  }
  const maxReached = (property.shape.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= currentProperty.objects.length + 1

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        groups: {
          ...focusNodeState.groups,
          [property.shape.group?.id.value]: {
            ...currentGroup,
            properties: {
              ...currentGroup.properties,
              [property.shape.path.id.value]: {
                ...currentProperty,
                maxReached,
                objects: [
                  ...property.objects,
                  newObject,
                ],
              },
            },
          },
        },
      },
    },
  }
}

interface RemoveObjectParams extends BaseParams {
  object: PropertyObjectState
}

export function removeObject(state: FormState, { focusNode, property, object }: RemoveObjectParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]
  const newValues = property.objects.filter(o => !o.object.term.equals(object.object.term))

  focusNodeState.focusNode
    .deleteOut(property.shape.path.id)
    .addOut(property.shape.path.id, newValues.map(o => o.object))

  const currentGroup = focusNodeState.groups[property.shape.group?.id.value]
  const maxReached = (property.shape.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= newValues.length

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        groups: {
          ...focusNodeState.groups,
          [property.shape.group?.id.value]: {
            ...currentGroup,
            properties: {
              ...currentGroup.properties,
              [property.shape.path.id.value]: {
                ...currentGroup.properties[property.shape.path.id.value],
                maxReached,
                objects: newValues,
              },
            },
          },
        },
      },
    },
  }
}

export function initialize(state: FormState, params: { focusNode: FocusNode; shape: Shape }): FormState {
  const { focusNode, shape } = params

  if (shape.targetClass) {
    focusNode.addOut(ns.rdf.type, shape.targetClass.id)
  }

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: initialiseFocusNode(shape, state.matchers, focusNode),
    },
  }
}
