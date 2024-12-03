import type { PropertyGroup } from '@rdfine/shacl'

export function byShOrder(left: PropertyGroup, right: PropertyGroup) {
  const leftOrder = left.order || 0
  const rightOrder = right.order || 0

  return leftOrder - rightOrder
}
