import type { PropertyShape } from '@rdfine/shacl'
import type { Resource } from '@rdfine/rdfs'

export function getPathProperty(shape: PropertyShape): Resource | undefined {
  return (Array.isArray(shape.path) ? shape.path[0] : shape.path)
}
