import { GraphPointer } from 'clownface'

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
