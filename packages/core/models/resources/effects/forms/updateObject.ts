import { GraphPointer } from 'clownface'
import { BlankNode, Term } from 'rdf-js'
import type { Store } from '../../../../state'
import * as updateObject from '../../../forms/reducers/updateObject'
import { notify } from '../../lib/notify'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph'

type Params = Omit<updateObject.UpdateObjectParams, 'object'> & {
  object: {
    object?: GraphPointer
  }
}

/**
 * Adds all quads from other pointer by ensuring new blank node identifiers to
 * prevent most conflicts. "Most", because the root node will be reused so it's not bulletproof
 */
function merge(mergeInto: GraphPointer, other: GraphPointer): void {
  const prefix = mergeInto.blankNode().value
  function prefixBlank(term: BlankNode | Term) {
    if (term.termType !== 'BlankNode') {
      return term
    }
    if (term.equals(other.term)) {
      return other.term
    }

    return mergeInto.blankNode(`${prefix}_${term.value}`).term
  }

  for (const { subject, predicate, object } of other.dataset) {
    mergeInto.node(prefixBlank(subject))
      .addOut(predicate, prefixBlank(object))
  }
}

export default function (store: Store) {
  return function ({ form, focusNode, property, object, newValue }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
    const pathProperty = property.getPathProperty(true).id
    if (!state?.graph) {
      return
    }

    if ('termType' in newValue) {
      if (newValue.equals(object.object?.term)) {
        return
      }
    }

    const focusNodePointer = state.graph.node(focusNode)
    if (object.object) {
      const children = focusNodePointer.out(pathProperty).toArray()
      focusNodePointer.deleteOut(pathProperty, object.object)
      deleteOrphanedSubgraphs(children)
    }
    if ('dataset' in newValue) {
      merge(focusNodePointer, newValue)
    }

    focusNodePointer.addOut(pathProperty, newValue)

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
