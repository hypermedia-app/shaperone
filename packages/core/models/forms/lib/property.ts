import type { PropertyShape, Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { fromPointer } from '@rdfine/shacl/lib/PropertyShape'

export function canAddObject(property: PropertyShape, length: number): boolean {
  return length < (property.maxCount || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  return length > (property.minCount || 0)
}

function isPropertyShape(shape: Shape): shape is PropertyShape {
  return shape.pointer.out(sh.path).terms.length > 0
}

function getProperties(shape: Shape): PropertyShape[] {
  if (isPropertyShape(shape)) {
    return [fromPointer(shape.pointer)]
  }

  return shape.property
}

export function combineProperties(shape: Shape): PropertyShape[] {
  return [
    shape,
    ...shape.and,
    ...shape.or,
    ...shape.xone,
  ].flatMap(getProperties)
}
