import { describe, it } from 'mocha'
import { expect } from 'chai'
import ns from '@rdf-esm/namespace'
import { quad } from '@rdf-esm/data-model'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { addMatchers } from '../../../../models/editors/reducers/addMatchers'
import { testState } from '../util'

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
    const after = addMatchers(before, { [ex.Foo.value]: editor })

    // then
    expect(after.allEditors).to.have.property(ex.Foo.value)
  })

  it('add editor to single editors if it is not dash:MultiEditor', () => {
    // given
    const metadata = [
      quad(ex.Foo, rdf.type, dash.Editor),
    ]
    const before = testState({
      metadata,
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
    const metadata = [
      quad(ex.Foo, rdf.type, dash.MultiEditor),
    ]
    const before = testState({
      metadata,
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
})
