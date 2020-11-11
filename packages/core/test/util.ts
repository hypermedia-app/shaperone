import type { PropertyShape } from '@rdfine/shacl'
import { PropertyShapeMixin } from '@rdfine/shacl'
import RdfResource, { Initializer, ResourceIdentifier } from '@tpluscode/rdfine/RdfResource'
import { GraphPointer } from 'clownface'
import PropertyShapeEx from '../models/shapes/lib/PropertyShape'

export function propertyShape(node: GraphPointer<ResourceIdentifier>, initializer? : Initializer<PropertyShape>): PropertyShape {
  return RdfResource.factory.createEntity<PropertyShape>(node, [PropertyShapeMixin, PropertyShapeEx], {
    initializer,
  })
}
