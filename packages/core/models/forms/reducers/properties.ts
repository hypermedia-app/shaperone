import { produce } from 'immer'
import type { Shape } from '@rdfine/shacl'
import type { FormState } from '../index.js'
import type { FocusNode } from '../../../index.js'

export interface ToggleParams {
  focusNode: FocusNode
  shape: Shape
}

function setHidden(hidden: boolean) {
  return (state: FormState, { focusNode, shape }: ToggleParams) => produce(state, (state) => {
    const focusNodeState = state.focusNodes[focusNode.value]
    const propertyStates = focusNodeState.properties.filter(p => p.shape.equals(shape) || shape.property.some(property => p.shape.equals(property)))

    for (const propertyState of propertyStates) {
      propertyState.hidden = hidden
    }
  })
}

export const showProperty = setHidden(false)

export const hideProperty = setHidden(true)
