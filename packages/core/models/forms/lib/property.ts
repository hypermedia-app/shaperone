import type { PropertyShape, Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { isResource } from 'is-graph-pointer'
import type { GraphPointer } from 'clownface'
import type { LogicalConstraints } from '../index.js'
import env from '../../../env.js'

export function canAddObject(property: PropertyShape, length: number): boolean {
  if (property.readOnly) return false

  return length < (property.maxCount || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  if (property.readOnly) return false

  return length > (property.minCount || 0)
}

function isPropertyShape(shape: GraphPointer): boolean {
  return shape.out(sh.path).terms.length > 0
}

function getProperties(constraint: GraphPointer): PropertyShape[] {
  const list = constraint.list()
  if (!list) {
    return []
  }

  return [...list].reduce<PropertyShape[]>((shapes, shape) => {
    if (!isResource(shape)) {
      return shapes
    }

    if (isPropertyShape(shape)) {
      return [...shapes, env().rdfine.sh.PropertyShape(shape)]
    }

    return [...shapes, ...shape.out(sh.property).filter(isResource).map((ptr: any) => env().rdfine.sh.PropertyShape(ptr))]
  }, [])
}

export function combineProperties(shape: Shape): { properties: PropertyShape[]; logicalConstraints: LogicalConstraints } {
  let properties: PropertyShape[] = shape.property
  const logicalConstraints: LogicalConstraints = { xone: [], and: [], or: [] }

  for (const constraint of shape.pointer.out(sh.and).toArray()) {
    const list = constraint.list()
    if (list) {
      properties = [...properties, ...getProperties(constraint)]
      logicalConstraints.and.push({
        term: constraint,
        component: sh.AndConstraintComponent,
        shapes: [...list].filter(isResource).map((ptr: any) => env().rdfine.sh.Shape(ptr)),
      })
    }
  }

  for (const constraint of shape.pointer.out(sh.or).toArray()) {
    const list = constraint.list()
    if (list) {
      properties = [...properties, ...getProperties(constraint)]
      logicalConstraints.or.push({
        term: constraint,
        component: sh.OrConstraintComponent,
        shapes: [...list].filter(isResource).map((ptr: any) => env.rdfine.sh.Shape(ptr)),
      })
    }
  }

  for (const constraint of shape.pointer.out(sh.xone).toArray()) {
    const list = constraint.list()
    if (list) {
      properties = [...properties, ...getProperties(constraint)]
      logicalConstraints.xone.push({
        term: constraint,
        component: sh.XoneConstraintComponent,
        shapes: [...list].filter(isResource).map((ptr: any) => env.rdfine.sh.Shape(ptr)),
      })
    }
  }

  return { properties, logicalConstraints }
}
