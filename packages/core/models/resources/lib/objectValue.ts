import type { PropertyShape } from '@rdfine/shacl'
import type { AnyPointer, GraphPointer, MultiPointer } from 'clownface'
import { dash, rdf, sh, xsd } from '@tpluscode/rdf-ns-builders'
import type { ResourceIdentifier } from '@tpluscode/rdfine'
import $rdf from 'rdf-ext'
import type { NamedNode, Term } from 'rdf-js'
import { nanoid } from 'nanoid'
import sh1 from '../../../ns.js'
import type { FocusNode } from '../../../index'

interface DefaultValue {
  property: PropertyShape
  editor?: NamedNode
  focusNode: FocusNode
  overrides?: MultiPointer
  editorMeta: AnyPointer
}

const TRUE = $rdf.literal('true', xsd.boolean)

export function defaultValue({ property, focusNode, editor, overrides, editorMeta }: DefaultValue): MultiPointer | null {
  let nodeKind = overrides?.out(sh.nodeKind).term || property.nodeKind

  if (property.defaultValue) {
    return focusNode.node(property.defaultValue)
  }

  if (!nodeKind && property.class) {
    // eslint-disable-next-line no-param-reassign
    nodeKind = sh.BlankNode
  }

  if (editor && !allowsImplicitDefault(editorMeta.node(editor))) {
    return null
  }

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

function allowsImplicitDefault(editor: GraphPointer) {
  return editor.out(sh1.implicitDefaultValue).term?.equals(TRUE)
}

function createResourceNode(property: PropertyShape, nodeKind: Term, focusNode: FocusNode) {
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
