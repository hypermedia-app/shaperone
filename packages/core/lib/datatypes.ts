import { xsd } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import type { Term } from '@rdfjs/types'
import TermSet from '@rdfjs/term-set'

const integerDatatypes = new TermSet<Term>([
  xsd.int,
  xsd.integer,
  xsd.nonNegativeInteger,
  xsd.nonPositiveInteger,
  xsd.positiveInteger,
  xsd.negativeInteger,
])

const decimalDatatypes = new TermSet<Term>([
  xsd.decimal,
  xsd.double,
  xsd.float,
])

export function numericDatatypeKind(datatype: ResourceIdentifier | undefined): 'integer' | 'decimal' | undefined {
  if (datatype) {
    if (integerDatatypes.has(datatype)) {
      return 'integer'
    }

    if (decimalDatatypes.has(datatype)) {
      return 'decimal'
    }
  }

  return undefined
}

export function isString(literal?: Term): boolean {
  return literal?.termType === 'Literal' && literal.datatype.equals(xsd.string)
}
