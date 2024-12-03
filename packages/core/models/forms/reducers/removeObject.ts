import type { PropertyShape } from '@rdfine/shacl'
import { objectStateProducer } from '../objectStateProducer.js'
import type { FocusNode } from '../../../index.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import type { PropertyObjectState } from '../index.js'

export interface RemoveObjectParams {
  focusNode: FocusNode
  property: PropertyShape
  object: PropertyObjectState
}

export const removeObject = objectStateProducer<RemoveObjectParams>((draft, { property, object }, propertyState) => {
  const objects = propertyState.objects.filter(o => o.key !== object.key)

  propertyState.objects = objects
  propertyState.canRemove = canRemoveObject(property, objects.length)
  propertyState.canAdd = canAddObject(property, objects.length)
})
