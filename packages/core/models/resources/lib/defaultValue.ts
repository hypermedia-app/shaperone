import type { PropertyShape } from '@rdfine/shacl'
import type { AnyPointer, GraphPointer } from 'clownface'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { RdfResource, ResourceIdentifier } from '@tpluscode/rdfine'
import { Term } from 'rdf-js'
import type { FocusNode } from '../../../index'
import * as datatypes from '../../../lib/datatypes'

function defaultNumericValue(datatype: RdfResource | undefined, graph: AnyPointer): Term | null {
  const numericDatatype = datatypes.numericDatatype(datatype?.id)
  if (numericDatatype) {
    return graph.literal('0', numericDatatype).term
  }

  return null
}

function defaultStringValue(datatype: RdfResource | undefined, graph: AnyPointer) {
  if (datatype?.id.termType === 'NamedNode') {
    return graph.literal('', datatype?.id).term
  }

  return graph.literal('').term
}

export function defaultValue(property: PropertyShape, focusNode: GraphPointer<FocusNode>): Term {
  const { nodeKind } = property

  if (property.defaultValue) {
    return property.defaultValue
  }

  if (property.class || nodeKind?.equals(sh.IRI) || nodeKind?.equals(sh.BlankNode) || nodeKind?.equals(sh.BlankNodeOrIRI)) {
    const resourceNode: GraphPointer<ResourceIdentifier> = nodeKind?.equals(sh.IRI) ? focusNode.namedNode('') : focusNode.blankNode()
    const propertyClass = property.class
    if (propertyClass && !property.get(dash.editor)?.equals(dash.InstancesSelectEditor)) {
      resourceNode.addOut(rdf.type, propertyClass.id)
    }

    return resourceNode.term
  }

  const { datatype } = property
  return defaultNumericValue(datatype, focusNode) || defaultStringValue(datatype, focusNode)
}
