/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/lib/property
 */

import { NamedNode, Term } from 'rdf-js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { literal, namedNode } from '@rdf-esm/data-model'
import { GraphPointer, MultiPointer } from 'clownface'
import TermSet from '@rdf-esm/term-set'
import type { PropertyState } from '../models/forms'

export function createTerm(property: Pick<PropertyState, 'shape' | 'datatype'>, value: string): Term {
  if (property.shape.nodeKind?.equals(sh.IRI)) {
    return namedNode(value)
  }

  return literal(value, property.datatype)
}

function traverse(node: MultiPointer, path: GraphPointer): MultiPointer {
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
export function findNodes(node: MultiPointer, shPath: GraphPointer | NamedNode): MultiPointer {
  const path = 'termType' in shPath ? node.node(shPath) : shPath
  return traverse(node, path)
}
