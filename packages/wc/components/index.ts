import type { FocusNodeState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'

export interface PropertyElement {
  property: PropertyState
  focusNode: FocusNodeState
}

export interface FocusNodeElement {
  focusNode: FocusNodeState
}
