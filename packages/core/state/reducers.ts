import type { FormState, PropertyObjectState } from '../state'
import cf from 'clownface'
import type { PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import * as ns from '@tpluscode/rdf-ns-builders'
import { FocusNode } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { sh } from '@tpluscode/rdf-ns-builders'
import { NamedNode, Term } from 'rdf-js'
import { blankNode, literal } from '@rdf-esm/data-model'
import RdfResource from '@tpluscode/rdfine/RdfResource'

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

function defaultValueNode(property: PropertyShape): Term {
  if (property.get(sh.class) || property.get(sh.nodeKind)?.id.equals(sh.IRI)) {
    return blankNode()
  }

  return literal('')
}

export function addObject(state: FormState, { focusNode, property }: BaseParams): FormState {
  const focusNodeState = state.focusNodes[focusNode.value]

  const object = property.defaultValue ? focusNodeState.focusNode.node(property.defaultValue) : focusNodeState.focusNode.node(defaultValueNode(property))

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

export function pushFocusNode(state: FormState, { focusNode, property }: { focusNode: FocusNode; property: PropertyShape }): FormState {
  const propertyTargetClass = property.get(sh.class)
  if (!propertyTargetClass) {
    return state
  }

  const shapePointer = state.shapesGraph!.has(sh.targetClass, propertyTargetClass.id).toArray()
  if (!shapePointer.length) {
    return state
  }

  const shape = RdfResource.factory.createEntity<Shape>(shapePointer[0])

  return {
    ...state,
    focusStack: [...state.focusStack, focusNode],
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: initialiseFocusNode({ focusNode, shape, state }),
    },
  }
}

export function truncateFocusNodes(state: FormState, { focusNode }: { focusNode: FocusNode }): FormState {
  const topNodeIndex = state.focusStack.findIndex(fn => fn.term.equals(focusNode.term))
  if (topNodeIndex < 0) {
    return state
  }

  return {
    ...state,
    focusStack: state.focusStack.slice(0, topNodeIndex),
  }
}

export function popFocusNode(state: FormState): FormState {
  return {
    ...state,
    focusStack: state.focusStack.slice(0, -1),
  }
}

export function selectGroup(state: FormState, { group, focusNode }: { focusNode: FocusNode; group?: PropertyGroup }): FormState {
  const groups = state.focusNodes[focusNode.value].groups.map(g => {
    let selected = false
    if (!group && !g.group) {
      selected = true
    } else {
      selected = group?.id.equals(g.group?.id) || false
    }

    return {
      ...g,
      selected,
    }
  })

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...state.focusNodes[focusNode.value],
        groups,
      },
    },
  }
}

export function initialize(state: FormState, params: { focusNode: FocusNode; shape: Shape }): FormState {
  if (state.shapesGraph) return { ...state }

  const { focusNode, shape } = params

  if (shape.targetClass) {
    focusNode.addOut(ns.rdf.type, shape.targetClass.id)
  }

  return {
    ...state,
    shapesGraph: cf({ dataset: shape._selfGraph.dataset }),
    focusStack: [focusNode],
    focusNodes: {
      [focusNode.value]: initialiseFocusNode({
        shape,
        state,
        focusNode,
      }),
    },
  }
}
