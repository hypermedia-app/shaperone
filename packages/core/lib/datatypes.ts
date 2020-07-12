import { xsd } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import { SingleContextClownface } from 'clownface'

const numericDatatypes = [
  xsd.int,
  xsd.integer,
  xsd.double,
  xsd.float,
  xsd.decimal,
  xsd.nonNegativeInteger,
  xsd.nonPositiveInteger,
  xsd.positiveInteger,
  xsd.negativeInteger,
]

export function numericDatatype(datatype: ResourceIdentifier | undefined): typeof numericDatatypes[0] | undefined {
  return numericDatatypes.find(dt => datatype?.equals(dt))
}

export function isString(literal: SingleContextClownface): boolean {
  return literal.term.termType === 'Literal' && literal.term.datatype.equals(xsd.string)
}
