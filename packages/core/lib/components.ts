import type { GraphPointer } from 'clownface'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { PropertyShape } from '@rdfine/shacl'
import type { Environment } from '@rdfjs/environment/Environment'
import { NsBuildersFactory } from '@tpluscode/rdf-ns-builders/Factory.js'
import type { SingleEditorComponent } from '../models/components/index.js'

export type CoreComponent<T extends SingleEditorComponent<any>> = Omit<T, 'render' | 'lazyRender' | 'env'>

export function sort(shape: PropertyShape, env: Environment<NsBuildersFactory>) {
  const orderByList = [...shape.pointer.out(env.ns.sh1.orderBy).list() || []]
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
