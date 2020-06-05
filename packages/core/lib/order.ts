import { RdfResource } from '@tpluscode/rdfine'
import { sh } from '@tpluscode/rdf-ns-builders'

export function byShOrder(left: RdfResource, right: RdfResource) {
  const leftOrder = left.getNumber(sh.order) || 0
  const rightOrder = right.getNumber(sh.order) || 0

  return leftOrder - rightOrder
}
