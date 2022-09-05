import type { NodeKind, PropertyShape } from '@rdfine/shacl'
import type { GraphPointer, MultiPointer } from 'clownface'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import type { NamedNode } from 'rdf-js'
import { nanoid } from 'nanoid'
import sh1 from '../../../ns.js'
import type { FocusNode } from '../../../index'

export function defaultValue(property: PropertyShape, focusNode: FocusNode): MultiPointer | null {
  if (property.defaultValue) {
    return focusNode.node(property.defaultValue)
  }

  const { nodeKind } = property
  switch (nodeKind?.value) {
    case 'http://www.w3.org/ns/shacl#IRI':
    case 'http://www.w3.org/ns/shacl#IRIOrLiteral':
    case 'http://www.w3.org/ns/shacl#BlankNode':
    case 'http://www.w3.org/ns/shacl#BlankNodeOrIRI':
    case 'http://www.w3.org/ns/shacl#BlankNodeOrLiteral':
      return createResourceNode(property, nodeKind, focusNode)
    default:
      return null
  }
}

function createResourceNode(property: PropertyShape, nodeKind: NodeKind, focusNode: FocusNode) {
  const uriStart = property.pointer.out(sh1.iriPrefix).value
  let resourceNode: GraphPointer<ResourceIdentifier> = focusNode.blankNode()

  if (nodeKind.equals(sh.IRI)) {
    resourceNode = createNewUri(property, focusNode, uriStart)
  } else if (uriStart && nodeKind.equals(sh.BlankNodeOrIRI)) {
    resourceNode = createNewUri(property, focusNode, uriStart)
  } else if (nodeKind.equals(sh.IRIOrLiteral)) {
    if (!uriStart) {
      return null
    }

    resourceNode = createNewUri(property, focusNode, uriStart)
  }

  const propertyClass = property.class
  if (propertyClass || nodeKind.equals(sh.IRI) || nodeKind.equals(sh.BlankNode) || nodeKind.equals(sh.BlankNodeOrIRI)) {
    if (propertyClass && !property.get(dash.editor)?.equals(dash.InstancesSelectEditor)) {
      return resourceNode.addOut(rdf.type, propertyClass.id)
    }
  }

  return resourceNode
}

function createNewUri(property: PropertyShape, focusNode: FocusNode, uriStart: string | undefined): GraphPointer<NamedNode> {
  const slug = nanoid()

  if (!uriStart) {
    return focusNode.namedNode(slug)
  }

  return focusNode.namedNode(`${uriStart}${slug}`)
}