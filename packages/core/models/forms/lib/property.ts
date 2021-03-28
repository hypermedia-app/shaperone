import type { PropertyShape, Shape } from '@rdfine/shacl'

export function canAddObject(property: PropertyShape, length: number): boolean {
  return length < (property.maxCount || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  return length > (property.minCount || 0)
}

export function combineProperties(shape: Shape): PropertyShape[] {
  return [
    shape,
    ...shape.and,
    ...shape.or,
    ...shape.xone,
  ].flatMap(shape => shape.property)
}
