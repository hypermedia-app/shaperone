import type { MultiPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdf-esm/term-set'

function traverse(node: MultiPointer, path: MultiPointer): MultiPointer {
  if (!path.term) {
    throw new Error('SHACL Path must be single node')
  }

  const list = path.list()
  if (list) {
    return [...list].reduce(traverse, node)
  }

  if (path.term.termType === 'BlankNode') {
    if (path.out(sh.inversePath).term) {
      return node.in(path.out(sh.inversePath).term)
    }

    if (path.out(sh.alternativePath).term) {
      const list = path.out(sh.alternativePath).list()
      if (list) {
        const results = [...list]
          .map(alt => traverse(node, alt))
          .reduce((uniq, mptr) => mptr.toArray().reduce((uniq, ptr) => uniq.add(ptr.term), uniq), new TermSet())

        return node.node(results)
      }

      throw new Error('Object of sh:alternativePath must be an RDF List')
    }

    if (path.out([sh.zeroOrMorePath, sh.oneOrMorePath]).term) {
      throw new Error('sh:zeroOrMorePath and sh:oneOrMorePath are not supported')
    }

    throw new Error(`Unrecognized property path ${path.value}`)
  }

  return node.out(path)
}

/**
 * Finds all nodes connected to the input node by following a [SHACL Property Path](https://www.w3.org/TR/shacl/#dfn-shacl-property-path)
 *
 * @param node starting node
 * @param shPath SHACL Property Path
 */
export function findNodes(node: MultiPointer, shPath: MultiPointer | NamedNode): MultiPointer {
  const path = 'termType' in shPath ? node.node(shPath) : shPath
  return traverse(node, path)
}
