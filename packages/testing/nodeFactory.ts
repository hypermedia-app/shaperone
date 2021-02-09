import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'

export function blankNode() {
  return clownface({ dataset: dataset() }).blankNode()
}
