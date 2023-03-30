import type { GraphPointer } from 'clownface'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { PropertyShape } from '@rdfine/shacl'
import type { SingleEditorComponent } from '../models/components'
import sh1 from '../ns.js'

export type CoreComponent<T extends SingleEditorComponent<any>> = Omit<T, 'render' | 'lazyRender'>

export function sort(shape: PropertyShape) {
  const orderByList = [...shape.pointer.out(sh1.orderBy).list() || []]
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
