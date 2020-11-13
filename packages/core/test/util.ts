import type { NodeShape, PropertyShape } from '@rdfine/shacl'
import { NodeShapeMixin, PropertyShapeMixin } from '@rdfine/shacl'
import RdfResource, { Initializer, ResourceIdentifier } from '@tpluscode/rdfine/RdfResource'
import clownface, { GraphPointer } from 'clownface'
import * as $rdf from '@rdf-esm/dataset'
import PropertyShapeEx from '../models/shapes/lib/PropertyShape'

function isPointer(arg: GraphPointer<ResourceIdentifier> | Initializer<PropertyShape> | undefined): arg is GraphPointer<ResourceIdentifier> {
  return (arg && '_context' in arg) || false
}

export function propertyShape(shape?: GraphPointer<ResourceIdentifier> | Initializer<PropertyShape>, init? : Initializer<PropertyShape>): PropertyShape {
  let node: GraphPointer<ResourceIdentifier>
  let initializer: Initializer<PropertyShape> | undefined

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

  return RdfResource.factory.createEntity<PropertyShape>(node, [PropertyShapeMixin, PropertyShapeEx], {
    initializer,
  })
}

function isTerm(term: any): term is ResourceIdentifier {
  return 'termType' in term
}

export function nodeShape(idOrInit: ResourceIdentifier | Initializer<NodeShape>, shape?: Initializer<NodeShape>): NodeShape {
  const graph = clownface({ dataset: $rdf.dataset() })
  if (isTerm(idOrInit)) {
    return new NodeShapeMixin.Class(graph.node(idOrInit), shape)
  }
  return new NodeShapeMixin.Class(graph.blankNode(), idOrInit)
}
