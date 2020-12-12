import { ShapeBundle, NodeShapeBundle, PropertyShapeBundle, PropertyGroupBundle } from '@rdfine/shacl/bundles'
import { PropertyShapeMixinEx } from '@rdfine/dash/extensions/sh'

export default [
  ...ShapeBundle,
  ...NodeShapeBundle,
  ...PropertyShapeBundle,
  ...PropertyGroupBundle,
  PropertyShapeMixinEx,
]
