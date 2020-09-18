import { Term } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { literal, namedNode } from '@rdf-esm/data-model'
import { PropertyShape } from '@rdfine/shacl'
import { Resource } from '@rdfine/rdfs'
import { GraphPointer } from 'clownface'
import type { PropertyState } from '../models/forms'

export function createTerm(property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.nodeKind?.equals(sh.IRI)) {
    return namedNode(value)
  }

  return literal(value, property.datatype)
}

export function getPathProperty(shape: PropertyShape): Resource {
  return (Array.isArray(shape.path) ? shape.path[0] : shape.path)!
}

export function getInPointers(shape: PropertyShape): GraphPointer[] {
  return [...shape.in].map(term => shape.pointer.node(term))
}
