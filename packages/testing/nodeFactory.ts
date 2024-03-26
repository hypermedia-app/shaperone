import type { NamedNode } from '@rdfjs/types'
import rdf from './env.js'

export function blankNode() {
  return rdf.clownface().blankNode()
}

export function namedNode(uri: string | NamedNode) {
  return rdf.clownface().namedNode(uri)
}

export function any() {
  return rdf.clownface()
}
