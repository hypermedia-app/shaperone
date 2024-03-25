import type { AnyPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import sinon from 'sinon'
import { matchMultiEditors, matchSingleEditors } from '@hydrofoil/shaperone-core/models/editors/lib/match.js'
import { EditorsState, MultiEditor, SingleEditor, MatcherDecorator, Editor } from '@hydrofoil/shaperone-core/models/editors'
import type { RecursivePartial } from '../index.js'

interface Initializer {
  metadata?: (metadata: AnyPointer) => AnyPointer
  singleEditors?: SingleEditor[]
  multiEditors?: MultiEditor[]
  decorators?: MatcherDecorator[]
  matchSingleEditors?: (...args: Parameters<typeof matchSingleEditors>) => RecursivePartial<ReturnType<typeof matchSingleEditors>>
  matchMultiEditors?: (...args: Parameters<typeof matchMultiEditors>) => RecursivePartial<ReturnType<typeof matchMultiEditors>>
}

function mapEditors<T extends Editor>(editors: Record<string, T>, editor: T) {
  return {
    ...editors,
    [editor.term.value]: editor,
  }
}

function mapDecorators(decorators: Record<string, MatcherDecorator[]>, decorator: MatcherDecorator) {
  decorators[decorator.term.value] = [
    ...decorators[decorator.term.value] || [],
    decorator,
  ]

  return decorators
}

export function testEditorsState({
  metadata = p => p,
  matchSingleEditors = () => [],
  matchMultiEditors = () => [],
  ...initialize
}: Initializer = {}): EditorsState {
  const singleEditors = initialize.singleEditors?.reduce(mapEditors, {}) || {}
  const multiEditors = initialize.multiEditors?.reduce(mapEditors, {}) || {}
  const decorators = initialize.decorators?.reduce(mapDecorators, {}) || {}

  return {
    singleEditors,
    multiEditors,
    decorators,
    allEditors: { ...singleEditors, ...multiEditors },
    metadata: metadata($rdf.clownface()),
    matchSingleEditors: sinon.stub().callsFake(matchSingleEditors),
    matchMultiEditors: sinon.stub().callsFake(matchMultiEditors),
  }
}
