import { describe, it } from 'mocha'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testEditor } from '@shaperone/testing/models/form'
import { testEditorsState as testState } from '@shaperone/testing/models/editors'
import { decorate } from '@hydrofoil/shaperone-core/models/editors/reducers/decorate'
import { MatcherDecorator, SingleEditor } from '@hydrofoil/shaperone-core/models/editors'

describe('core/models/editors/reducers/decorate', () => {
  it('creates decorator array for editor', () => {
    // given
    const before = testState()
    const decorator: MatcherDecorator = {
      term: dash.FooEditor,
      decorate({ match }: SingleEditor) {
        return match
      },
    }

    // when
    const after = decorate(before, decorator)

    // then
    expect(after.decorators[dash.FooEditor.value]).to.contains(decorator)
  })

  it('applies decorator to existing single editors', () => {
    // given
    const before = testState({
      singleEditors: [testEditor(dash.FooEditor)],
    })
    const decoratedMatch = (m: any) => m
    const decorator: MatcherDecorator = {
      term: dash.FooEditor,
      decorate: () => decoratedMatch,
    }

    // when
    const after = decorate(before, decorator)

    // then
    expect(after.singleEditors[dash.FooEditor.value]).to.have.property('match', decoratedMatch)
  })

  it('applies decorator to existing multi editors', () => {
    // given
    const before = testState({
      multiEditors: [testEditor(dash.FooEditor)],
    })
    const decoratedMatch = (m: any) => m
    const decorator: MatcherDecorator = {
      term: dash.FooEditor,
      decorate: () => decoratedMatch,
    }

    // when
    const after = decorate(before, decorator)

    // then
    expect(after.multiEditors[dash.FooEditor.value]).to.have.property('match', decoratedMatch)
  })
})
