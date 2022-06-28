import { describe, it } from 'mocha'
import { expect } from 'chai'
import ns from '@rdf-esm/namespace'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testEditorsState as testState } from '@shaperone/testing/models/editors'
import { addMatchers } from '@hydrofoil/shaperone-core/models/editors/reducers/addMatchers'

const ex = ns('http://example.com/')

describe('core/models/editors/reducers/addMatchers', () => {
  it('add any editor to all editors', () => {
    // given
    const before = testState()
    const editor = {
      term: ex.Foo,
      match: () => 1,
    }

    // when
    const after = addMatchers(before, { editor })

    // then
    expect(after.allEditors).to.have.property(ex.Foo.value)
  })

  it('add any editor to all editors using array', () => {
    // given
    const before = testState()
    const editor = {
      term: ex.Foo,
      match: () => 1,
    }

    // when
    const after = addMatchers(before, [editor])

    // then
    expect(after.allEditors).to.have.property(ex.Foo.value)
  })

  it('add editor to single editors if it is not dash:MultiEditor', () => {
    // given
    const before = testState({
      metadata(ptr) {
        return ptr.node(ex.Foo).addOut(rdf.type, dash.Editor)
      },
    })
    const editor = {
      term: ex.Foo,
      match: () => 1,
    }

    // when
    const after = addMatchers(before, { [ex.Foo.value]: editor })

    // then
    expect(after.singleEditors).to.have.property(ex.Foo.value)
  })

  it('add editor to multi editors if it is type dash:MultiEditor', () => {
    // given
    const before = testState({
      metadata(ptr) {
        return ptr.node(ex.Foo).addOut(rdf.type, dash.MultiEditor)
      },
    })
    const editor = {
      term: ex.Foo,
      match: () => 1,
    }

    // when
    const after = addMatchers(before, { [ex.Foo.value]: editor })

    // then
    expect(after.multiEditors).to.have.property(ex.Foo.value)
  })

  it('applies decorators for added single editor', () => {
    // given
    const decoratedMatch = (m: any) => m
    const before = testState({
      decorators: [{
        term: dash.FooEditor,
        decorate: () => decoratedMatch,
      }],
    })
    const editor = {
      term: dash.FooEditor,
      match: () => 1,
    }

    // then
    const after = addMatchers(before, { [ex.Foo.value]: editor })

    // then
    expect(after.singleEditors[dash.FooEditor.value]).to.have.property('match', decoratedMatch)
  })

  it('applies decorators for added multi editor', () => {
    // given
    const decoratedMatch = (m: any) => m
    const before = testState({
      metadata(ptr) {
        return ptr.node(dash.FooEditor).addOut(rdf.type, dash.MultiEditor)
      },
      decorators: [{
        term: dash.FooEditor,
        decorate: () => decoratedMatch,
      }],
    })
    const editor = {
      term: dash.FooEditor,
      match: () => 1,
    }

    // then
    const after = addMatchers(before, { [ex.Foo.value]: editor })

    // then
    expect(after.multiEditors[dash.FooEditor.value]).to.have.property('match', decoratedMatch)
  })
})
