/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/lib/property
 */

import type { Term } from '@rdfjs/types'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { PropertyState } from '../models/forms/index.js'
import type { ShaperoneEnvironment } from '../env.js'

export function createTerm(env: ShaperoneEnvironment, property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.nodeKind?.equals(sh.IRI)) {
    return env.namedNode(value)
  }

  return env.literal(value, property.datatype)
}
