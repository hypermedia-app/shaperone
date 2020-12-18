import cf from 'clownface'
import $rdf from 'rdf-ext'
import { Quad } from 'rdf-js'
import { EditorsState, MultiEditor, SingleEditor, SingleEditorDecorator } from '../../../models/editors/index'

interface Initializer {
  metadata?: Quad[]
  singleEditors?: SingleEditor[]
  multiEditors?: MultiEditor[]
  decorators?: SingleEditorDecorator[]
}

function mapEditors<T extends SingleEditor | MultiEditor | SingleEditorDecorator>(editors: Record<string, T>, editor: T) {
  return {
    ...editors,
    [editor.term.value]: editor,
  }
}

export function testState(initializer: Initializer = { }): EditorsState {
  const singleEditors = initializer.singleEditors?.reduce(mapEditors, {}) || {}
  const multiEditors = initializer.multiEditors?.reduce(mapEditors, {}) || {}
  const decorators = initializer.decorators?.reduce(mapEditors, {}) || {}

  return {
    singleEditors,
    multiEditors,
    decorators,
    allEditors: { ...singleEditors, ...multiEditors },
    metadata: cf({ dataset: $rdf.dataset(initializer.metadata || []) }),
    matchSingleEditors: () => [],
    matchMultiEditors: () => [],
  }
}
