import type { PropertyShape, Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { fromPointer } from '@rdfine/shacl/lib/PropertyShape'
import { fromPointer as createShape } from '@rdfine/shacl/lib/Shape'
import { BlankNode, NamedNode } from 'rdf-js'
import type { GraphPointer } from 'clownface'
import type { LogicalConstraints } from '../index'

export function canAddObject(property: PropertyShape, length: number): boolean {
  return length < (property.maxCount || Number.POSITIVE_INFINITY)
}

export function canRemoveObject(property: PropertyShape, length: number): boolean {
  return length > (property.minCount || 0)
}

function isPropertyShape(shape: GraphPointer): boolean {
  return shape.out(sh.path).terms.length > 0
}

function isResourceNode(ptr: GraphPointer): ptr is GraphPointer<BlankNode> | GraphPointer<NamedNode> {
  return ptr.term.termType === 'BlankNode' || ptr.term.termType === 'NamedNode'
}

function getProperties(constraint: GraphPointer): PropertyShape[] {
  const list = constraint.list()
  if (!list) {
    return []
  }

  return [...list].reduce<PropertyShape[]>((shapes, shape) => {
    if (!isResourceNode(shape)) {
      return shapes
    }

    if (isPropertyShape(shape)) {
      return [...shapes, fromPointer(shape)]
    }

    return [...shapes, ...shape.out(sh.property).filter(isResourceNode).map((ptr: any) => fromPointer(ptr))]
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
        shapes: [...list].filter(isResourceNode).map((ptr: any) => createShape(ptr)),
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
        shapes: [...list].filter(isResourceNode).map((ptr: any) => createShape(ptr)),
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
        shapes: [...list].filter(isResourceNode).map((ptr: any) => createShape(ptr)),
      })
    }
  }

  return { properties, logicalConstraints }
}
