import {
  ShapeBundle,
  NodeShapeBundle,
  PropertyShapeBundle,
  PropertyGroupBundle,
  ValidationReportBundle,
} from '@rdfine/shacl/bundles'
import { PropertyShapeMixinEx } from '@rdfine/dash/extensions/sh'

export default [
  ...ShapeBundle,
  ...NodeShapeBundle,
  ...PropertyShapeBundle,
  ...PropertyGroupBundle,
  ...ValidationReportBundle,
  PropertyShapeMixinEx,
]
