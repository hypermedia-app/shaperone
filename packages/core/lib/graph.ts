import { GraphPointer } from 'clownface'
import { BlankNode, Term } from 'rdf-js'

export function deleteOrphanedSubgraphs(roots: GraphPointer[]): void {
  const nextChildren =
    roots.reduce<GraphPointer[]>((previous, child) => {
      if (child.term.termType !== 'BlankNode') {
        return previous
      }
      if (child.in().terms.length) {
        return previous
      }

      const children = child.out().toArray()
      child.deleteOut()
      return [...previous, ...children]
    }, [])

  if (nextChildren.length) {
    deleteOrphanedSubgraphs(nextChildren)
  }
}

export function merge(focusNode: GraphPointer, newValue: GraphPointer): Term {
  const prefix = focusNode.blankNode().value
  function prefixBlank(term: BlankNode | Term) {
    if (term.termType === 'BlankNode') {
      return focusNode.blankNode(`${prefix}_${term.value}`).term
    }

    return term
  }

  for (const { subject, predicate, object } of newValue.dataset) {
    focusNode.node(prefixBlank(subject))
      .addOut(predicate, prefixBlank(object))
  }

  return prefixBlank(newValue.term)
}
