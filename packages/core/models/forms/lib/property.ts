import { sh } from '@tpluscode/rdf-ns-builders'
import { PropertyShape } from '@rdfine/shacl'

export function canAddObject(property: PropertyShape, length: number): boolean {
  return length < (property.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  return length > (property.getNumber(sh.minCount) || 0)
}
