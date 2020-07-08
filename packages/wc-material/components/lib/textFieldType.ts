import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes'

export function getType(datatype: ReturnType<typeof numericDatatype> | undefined) {
  if (numericDatatype(datatype)) {
    return 'number'
  }

  return 'text'
}
