import cf from 'clownface'
import $rdf from 'rdf-ext'
import { Quad } from 'rdf-js'
import { EditorsState, MultiEditor, SingleEditor } from '../../../models/editors/index'

interface Initializer {
  metadata?: Quad[]
  singleEditors?: SingleEditor[]
  multiEditors?: MultiEditor[]
}

function mapEditors<T extends SingleEditor | MultiEditor>(editors: Record<string, T>, editor: T) {
  return {
    ...editors,
    [editor.term.value]: editor,
  }
}

export function testState(initializer: Initializer = { }): EditorsState {
  const singleEditors = initializer.singleEditors?.reduce(mapEditors, {}) || {}
  const multiEditors = initializer.multiEditors?.reduce(mapEditors, {}) || {}

  return {
    singleEditors,
    multiEditors,
    allEditors: { ...singleEditors, ...multiEditors },
    metadata: cf({ dataset: $rdf.dataset(initializer.metadata || []) }),
  }
}
