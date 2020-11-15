import { xsd } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import { NamedNode, Term } from 'rdf-js'

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

export function numericDatatype(datatype: ResourceIdentifier | undefined): NamedNode | undefined {
  return numericDatatypes.find(dt => datatype?.equals(dt))
}

export function isString(literal?: Term): boolean {
  return literal?.termType === 'Literal' && literal.datatype.equals(xsd.string)
}
