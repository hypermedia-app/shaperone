import { numericDatatypeKind } from '@hydrofoil/shaperone-core/lib/datatypes.js'
import type { NamedNode } from '@rdfjs/types'

export function getType(datatype: NamedNode | undefined) {
  const numericDatatype = numericDatatypeKind(datatype)

  if (numericDatatype) {
    return {
      type: 'number',
      step: numericDatatype === 'integer' ? undefined : 'any',
    }
  }

  return { type: 'text' }
}
