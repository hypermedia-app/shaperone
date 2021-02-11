import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import { NamedNode } from 'rdf-js'

export function blankNode() {
  return clownface({ dataset: dataset() }).blankNode()
}

export function namedNode(uri: string | NamedNode) {
  return clownface({ dataset: dataset() }).namedNode(uri)
}

export function any() {
  return clownface({ dataset: dataset() })
}
