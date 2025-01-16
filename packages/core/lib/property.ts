/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/lib/property
 */

import type { Term } from '@rdfjs/types'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { PropertyState } from '../models/forms/index.js'
import getEnv from '../env.js'

export function createTerm(property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.nodeKind?.equals(sh.IRI)) {
    return getEnv().namedNode(value)
  }

  return getEnv().literal(value, property.datatype)
}
