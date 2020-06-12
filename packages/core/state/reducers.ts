import type { FormState, PropertyObjectState } from '../state'
import type { PropertyShape, Shape } from '@rdfine/shacl'
import * as ns from '@tpluscode/rdf-ns-builders'
import { FocusNode } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { sh } from '@tpluscode/rdf-ns-builders'
import { NamedNode, Term } from 'rdf-js'

interface BaseParams {
  focusNode: FocusNode
  property: PropertyShape
}

interface SelectEditorParams extends BaseParams {
  value: Term
  editor: NamedNode
}

export function selectEditor(state: FormState, { focusNode, property, value, editor }: SelectEditorParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]
  const properties = focusNodeState.properties.map(prop => {
    if (!prop.shape.id.equals(property.id)) {
      return prop
    }

    const objects = prop.objects.map(o => {
      if (o.object.term.equals(value)) {
        return {
          ...o,
          selectedEditor: editor,
        }
      }

      return o
    })

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
}

interface UpdateObjectParams extends BaseParams {
  oldValue: Term
  newValue: Term
}

export function updateObject(state: FormState, { focusNode, property, oldValue, newValue }: UpdateObjectParams): FormState {
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
}

export function addObject(state: FormState, { focusNode, property }: BaseParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]

  const object = property.defaultValue ? focusNodeState.focusNode.node(property.defaultValue) : focusNodeState.focusNode.literal('')

  focusNodeState.focusNode.addOut(property.path.id, object)

  const properties = focusNodeState.properties.map(currentProperty => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }
    if (currentProperty.objects.find(o => o.object.term.equals(object.term))) {
      return currentProperty
    }

    const editors = [...state.editorMap.values()]
      .map(({ match }) => match(property, object))
      .filter(match => match.score === null || match.score > 0)
      .sort((left, right) => left.score! - right.score!)

    const maxReached = (property.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= currentProperty.objects.length + 1
    const newObject: PropertyObjectState = {
      object,
      editors,
      selectedEditor: editors[0]?.editor,
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
}

interface RemoveObjectParams extends BaseParams {
  object: PropertyObjectState
}

export function removeObject(state: FormState, { focusNode, property, object }: RemoveObjectParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]

  const properties = focusNodeState.properties.map(currentProperty => {
    if (!currentProperty.shape.id.equals(property.id)) {
      return currentProperty
    }

    const objects = currentProperty.objects.filter(o => !o.object.term.equals(object.object.term))

    focusNodeState.focusNode
      .deleteOut(property.path.id)
      .addOut(property.path.id, objects.map(o => o.object))

    const maxReached = (property.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= objects.length

    return {
      ...currentProperty,
      objects,
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
}

export function editorLoading(state: FormState, { editor }: { editor: NamedNode }): FormState {
  return {
    ...state,
    editors: {
      ...state.editors,
      [editor.value]: {
        loaded: false,
      },
    },
  }
}

export function editorLoaded(state: FormState, { editor }: { editor: NamedNode }): FormState {
  return {
    ...state,
    editors: {
      ...state.editors,
      [editor.value]: {
        loaded: true,
      },
    },
  }
}

export function resetEditors(state: FormState): FormState {
  return {
    ...state,
    editors: {},
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
      [focusNode.value]: initialiseFocusNode({
        shape,
        editors: [...state.editorMap.values()],
        compoundEditors: [...state.compoundEditorMap.values()],
        focusNode,
      }),
    },
  }
}
