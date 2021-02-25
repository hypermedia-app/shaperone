/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/lib/property
 */

import { Term } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { literal, namedNode } from '@rdf-esm/data-model'
import type { PropertyState } from '../models/forms'

export function createTerm(property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.nodeKind?.equals(sh.IRI)) {
    return namedNode(value)
  }

  return literal(value, property.datatype)
}
