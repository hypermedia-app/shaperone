import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer, MultiPointer } from 'clownface'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import type { FocusNode } from '../../../index'

export function defaultValue(property: PropertyShape, focusNode: FocusNode): MultiPointer | null {
  const { nodeKind } = property

  if (property.defaultValue) {
    return focusNode.node(property.defaultValue)
  }

  const propertyClass = property.class
  if (propertyClass || nodeKind?.equals(sh.IRI) || nodeKind?.equals(sh.BlankNode) || nodeKind?.equals(sh.BlankNodeOrIRI)) {
    const resourceNode: GraphPointer<ResourceIdentifier> = nodeKind?.equals(sh.IRI) ? focusNode.namedNode('') : focusNode.blankNode()
    if (propertyClass && !property.get(dash.editor)?.equals(dash.InstancesSelectEditor)) {
      resourceNode.addOut(rdf.type, propertyClass.id)
    }

    return resourceNode
  }

  return null
}
