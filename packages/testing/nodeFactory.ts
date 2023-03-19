import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { NamedNode } from 'rdf-js'

export function blankNode() {
  return clownface({ dataset: $rdf.dataset() }).blankNode()
}

export function namedNode(uri: string | NamedNode) {
  return clownface({ dataset: $rdf.dataset() }).namedNode(uri)
}

export function any() {
  return clownface({ dataset: $rdf.dataset() })
}
