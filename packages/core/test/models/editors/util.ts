import cf from 'clownface'
import $rdf from 'rdf-ext'
import { Quad } from 'rdf-js'
import { EditorsState } from '../../../models/editors/index'

interface Initializer {
  metadata?: Quad[]
}

export function testState(initializer: Initializer = { }): EditorsState {
  return {
    allEditors: {},
    singleEditors: {},
    multiEditors: {},
    metadata: cf({ dataset: $rdf.dataset(initializer.metadata || []) }),
  }
}
