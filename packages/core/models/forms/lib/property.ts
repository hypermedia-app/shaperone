import { PropertyShape } from '@rdfine/shacl'

export function canAddObject(property: PropertyShape, length: number): boolean {
  return length < (property.maxCount || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  return length > (property.minCount || 0)
}
