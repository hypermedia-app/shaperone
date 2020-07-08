import type { PropertyShape } from '@rdfine/shacl'
import type { Clownface, SingleContextClownface } from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { RdfResource } from '@tpluscode/rdfine'
import type { FocusNode } from '../../../index'
import * as datatypes from '../../../lib/datatypes'

function defaultNumericValue(datatype: RdfResource | undefined, graph: Clownface): SingleContextClownface | null {
  const numericDatatype = datatypes.numericDatatype(datatype?.id)
  if (numericDatatype) {
    return graph.literal('0', numericDatatype)
  }

  return null
}

function defaultStringValue(datatype: RdfResource | undefined, graph: Clownface) {
  if (datatype?.id.termType === 'NamedNode') {
    return graph.literal('', datatype?.id)
  }

  return graph.literal('')
}

export function defaultValue(property: PropertyShape, focusNode: FocusNode): SingleContextClownface {
  const nodeKind = property.get(sh.nodeKind)

  if (property.get(sh.class) || nodeKind?.id.equals(sh.IRI) || nodeKind?.id.equals(sh.BlankNode) || nodeKind?.id.equals(sh.BlankNodeOrIRI)) {
    const resourceNode = focusNode.blankNode()
    const propertyClass = property.get(sh.class)
    if (propertyClass) {
      resourceNode.addOut(rdf.type, propertyClass.id)
    }

    return resourceNode
  }

  const datatype = property.get(sh.datatype)
  return defaultNumericValue(datatype, focusNode) || defaultStringValue(datatype, focusNode)
}
