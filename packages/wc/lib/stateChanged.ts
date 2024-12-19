import type {
  FocusNodeState,
  PropertyGroupState,
  PropertyObjectState,
  PropertyState,
} from '@hydrofoil/shaperone-core/models/forms/index.js'

export function focusNodeChanged(value: FocusNodeState | undefined, oldValue: FocusNodeState | undefined) {
  if (value === oldValue) {
    return false
  }

  const sameFocusNodeId = value?.focusNode.term.equals(oldValue?.focusNode.term)
  const sameShapeId = value?.shape?.equals(oldValue?.shape)
  const sameDataset = value?.shape?.pointer.dataset === oldValue?.shape?.pointer.dataset

  return !sameFocusNodeId || !sameShapeId || !sameDataset
}

export function groupChanged(value: PropertyGroupState | undefined, oldValue: PropertyGroupState | undefined) {
  if (value === oldValue) {
    return false
  }

  const sameGroup = value?.group?.equals(oldValue?.group)
  const sameDataset = value?.group?.pointer.dataset === oldValue?.group?.pointer.dataset

  return !sameGroup || !sameDataset
}

export function propertyChanged(value: PropertyState | undefined, oldValue: PropertyState | undefined) {
  if (value === oldValue) {
    return false
  }

  const samePropertyShape = value?.shape.equals(oldValue?.shape)
  const sameDataset = value?.shape.pointer.dataset === oldValue?.shape.pointer.dataset

  return !samePropertyShape || !sameDataset
}

export function objectChanged(value: PropertyObjectState | undefined, oldValue: PropertyObjectState | undefined) {
  if (value === oldValue) {
    return false
  }

  const equalObject = value?.object?.term.equals(oldValue?.object?.term)
  const sameDataset = value?.object?.dataset === oldValue?.object?.dataset

  return !equalObject || !sameDataset
}
