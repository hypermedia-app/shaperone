import type { NamedNode } from '@rdfjs/types'
import type { PropertyShape } from '@rdfine/shacl'
import { produce } from 'immer'
import type { FocusNode } from '../../../index.js'
import type { FormState, PropertyObjectState } from '../index.js'

export interface SelectEditorParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
  editor: NamedNode
}

export const selectEditor = (state: FormState, { focusNode, property, object, editor }: SelectEditorParams) => produce(state, (state) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const propertyState = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!propertyState) {
    return
  }

  const found = propertyState.objects.find(o => o.key === object.key)
  if (found) {
    found.selectedEditor = editor
  }
})
