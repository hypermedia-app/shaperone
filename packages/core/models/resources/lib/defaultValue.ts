import type { PropertyShape } from '@rdfine/shacl'
import type { AnyPointer, GraphPointer, MultiPointer } from 'clownface'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { RdfResource, ResourceIdentifier } from '@tpluscode/rdfine'
import type { FocusNode } from '../../../index'
import * as datatypes from '../../../lib/datatypes'

function defaultNumericValue(datatype: RdfResource | undefined, graph: AnyPointer): GraphPointer | null {
  const numericDatatype = datatypes.numericDatatype(datatype?.id)
  if (numericDatatype) {
    return graph.literal('0', numericDatatype)
  }

  return null
}

function defaultStringValue(datatype: RdfResource | undefined, graph: AnyPointer) {
  if (datatype?.id.termType === 'NamedNode') {
    return graph.literal('', datatype?.id)
  }

  return graph.literal('')
}

export function defaultValue(property: PropertyShape, focusNode: FocusNode): MultiPointer {
  const { nodeKind } = property

  if (property.defaultValue) {
    return focusNode.node(property.defaultValue)
  }

  if (property.class || nodeKind?.equals(sh.IRI) || nodeKind?.equals(sh.BlankNode) || nodeKind?.equals(sh.BlankNodeOrIRI)) {
    const resourceNode: GraphPointer<ResourceIdentifier> = nodeKind?.equals(sh.IRI) ? focusNode.namedNode('') : focusNode.blankNode()
    const propertyClass = property.class
    if (propertyClass && !property.get(dash.editor)?.equals(dash.InstancesSelectEditor)) {
      resourceNode.addOut(rdf.type, propertyClass.id)
    }

    return resourceNode
  }

  const { datatype } = property
  return defaultNumericValue(datatype, focusNode) || defaultStringValue(datatype, focusNode)
}
