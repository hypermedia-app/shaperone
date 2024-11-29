import type { Draft } from 'immer'
import { produce } from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import type { FormState, PropertyState } from './index.js'
import type { BaseParams } from '../index.js'
import type { FocusNode } from '../../index.js'

interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
}

/**
 * Reducer decorator which prevents mutating objects of `dash:readOnly` properties
 */
export function objectStateProducer<T extends Params>(mutate: (draft: Draft<FormState>, params: T, propertyState: Draft<PropertyState>) => void) {
  return (state: FormState, params: T) => produce(state, (draft) => {
    const focusNodeState = draft.focusNodes[params.focusNode.value]
    const propertyState = focusNodeState.properties.find(p => p.shape.equals(params.property))

    if (propertyState && params.property.readOnly !== true) {
      mutate(draft, params, propertyState)
    }
  })
}
