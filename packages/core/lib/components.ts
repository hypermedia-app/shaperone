import type { GraphPointer } from 'clownface'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import type { PropertyShape } from '@rdfine/shacl'
import env from '../env.js'

export function sort(shape: PropertyShape) {
  const orderByList = [...shape.pointer.out(env().ns.sh1.orderBy).list() || []]
  const orderByPredicates = orderByList.length ? orderByList.map(i => i.term) : [rdfs.label]

  return (left: GraphPointer, right: GraphPointer) => orderByPredicates.reduce((result, predicate) => {
    if (result) {
      return result
    }

    const leftLabel = getLocalizedLabel(left.out(predicate)) || left.value
    const rightLabel = getLocalizedLabel(right.out(predicate)) || right.value
    return leftLabel.localeCompare(rightLabel)
  }, 0)
}
