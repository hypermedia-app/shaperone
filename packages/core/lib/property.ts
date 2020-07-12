import { Term } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { literal, namedNode } from '@rdfjs/data-model'
import { PropertyState } from '../models/forms'

export function createTerm(property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.get(sh.nodeKind)?.equals(sh.IRI)) {
    return namedNode(value)
  }

  return literal(value, property.datatype)
}
