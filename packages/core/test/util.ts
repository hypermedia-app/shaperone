import * as NodeShape from '@rdfine/shacl/lib/NodeShape'
import * as PropertyShape from '@rdfine/shacl/lib/PropertyShape'
import RdfResource, { Initializer, ResourceIdentifier } from '@tpluscode/rdfine/RdfResource'
import clownface, { GraphPointer } from 'clownface'
import * as $rdf from '@rdf-esm/dataset'
import PropertyShapeEx from '../models/shapes/lib/PropertyShape'

RdfResource.factory.addMixin(PropertyShapeEx)

function isPointer(arg: GraphPointer<ResourceIdentifier> | Initializer<PropertyShape.PropertyShape> | undefined): arg is GraphPointer<ResourceIdentifier> {
  return (arg && '_context' in arg) || false
}

export function propertyShape(shape?: GraphPointer<ResourceIdentifier> | Initializer<PropertyShape.PropertyShape>, init? : Initializer<PropertyShape.PropertyShape>): PropertyShape.PropertyShape {
  let node: GraphPointer<ResourceIdentifier>
  let initializer: Initializer<PropertyShape.PropertyShape> | undefined

  if (isPointer(shape)) {
    node = shape
    if (init) {
      initializer = init
    }
  } else {
    node = clownface({ dataset: $rdf.dataset() }).blankNode()
    if (shape) {
      initializer = shape
    }
  }

  return PropertyShape.fromPointer(node, initializer, { additionalMixins: [PropertyShapeEx] })
}

function isTerm(term: any): term is ResourceIdentifier {
  return 'termType' in term
}

export function nodeShape(idOrInit: GraphPointer<ResourceIdentifier> | ResourceIdentifier | Initializer<NodeShape.NodeShape>, shape?: Initializer<NodeShape.NodeShape>): NodeShape.NodeShape {
  if (isPointer(idOrInit)) {
    return NodeShape.fromPointer(idOrInit, shape)
  }

  const graph = clownface({ dataset: $rdf.dataset() })
  if (isTerm(idOrInit)) {
    return NodeShape.fromPointer(graph.node(idOrInit), shape)
  }
  return NodeShape.fromPointer(graph.blankNode(), idOrInit)
}
