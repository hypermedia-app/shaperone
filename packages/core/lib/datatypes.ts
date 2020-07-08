import { xsd } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'

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
