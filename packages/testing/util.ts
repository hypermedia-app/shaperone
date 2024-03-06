import * as NodeShape from '@rdfine/shacl/lib/NodeShape'
import * as PropertyShape from '@rdfine/shacl/lib/PropertyShape'
import { Initializer, ResourceIdentifier } from '@tpluscode/rdfine/RdfResource'
import type { GraphPointer } from 'clownface'
import PropertyShapeEx from '@hydrofoil/shaperone-core/models/shapes/lib/PropertyShape.js'
import { PropertyShapeMixinEx } from '@rdfine/dash/extensions/sh'
import $rdf from './env.js'

$rdf.rdfine().factory.addMixin(PropertyShapeEx, PropertyShapeMixinEx)

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
    node = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
    if (shape) {
      initializer = shape
    }
  }

  return $rdf.rdfine.sh.PropertyShape(node, initializer, { additionalMixins: [PropertyShapeEx] })
}

function isTerm(term: any): term is ResourceIdentifier {
  return 'termType' in term
}

export function nodeShape(idOrInit: GraphPointer<ResourceIdentifier> | ResourceIdentifier | Initializer<NodeShape.NodeShape>, shape?: Initializer<NodeShape.NodeShape>): NodeShape.NodeShape {
  if (isPointer(idOrInit)) {
    return $rdf.rdfine.sh.NodeShape(idOrInit, shape)
  }

  const graph = $rdf.clownface({ dataset: $rdf.dataset() })
  if (isTerm(idOrInit)) {
    return $rdf.rdfine.sh.NodeShape(graph.node(idOrInit), shape)
  }
  return $rdf.rdfine.sh.NodeShape(graph.blankNode(), idOrInit)
}
