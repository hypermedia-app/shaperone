import type { Draft } from 'immer'
import { produce } from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import type { Term } from '@rdfjs/types'
import type { FormState, PropertyState } from './index.js'
import type { FocusNode } from '../../index.js'

interface Params {
  focusNode: FocusNode
  property: PropertyShape
  parentShape?: Term
}

/**
 * Reducer decorator which prevents mutating objects of `dash:readOnly` properties
 */
export function objectStateProducer<T extends Params>(mutate: (draft: Draft<FormState>, params: T, propertyState: Draft<PropertyState>) => void) {
  return (state: FormState, params: T) => produce(state, (draft) => {
    let focusNodeState
    if (params.parentShape) {
      focusNodeState = draft.detailNodes[`${params.focusNode.value}/${params.parentShape.value}`]
    } else {
      focusNodeState = draft.focusNodes[params.focusNode.value]
    }
    const propertyState = focusNodeState?.properties.find(p => p.shape.equals(params.property))

    if (propertyState && params.property.readOnly !== true) {
      mutate(draft, params, propertyState)
    }
  })
}
