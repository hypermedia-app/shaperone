import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { quad, literal } from '@rdf-esm/data-model'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { testEditorsState as testState } from '@shaperone/testing/models/editors'
import { blankNode } from '@shaperone/testing/nodeFactory'
import { addMetadata } from '../../../../models/editors/reducers/addMetadata'

const ex = ns('http://example.com/')

describe('core/models/editors/reducers/addMetadata', () => {
  it('merges datasets', () => {
    // given
    const before = testState({
      metadata(ptr) {
        return ptr.node(ex.Foo).addOut(rdf.type, dash.MultiEditor)
      },
    })

    // when
    const dataset = $rdf.dataset([
      quad(ex.Bar, rdf.type, dash.Editor),
    ])
    const after = addMetadata(before, dataset)

    // then
    expect(after.metadata.dataset).to.have.property('size', 2)
  })

  it('updates existing editors', () => {
    // given
    const fooEditor = {
      term: ex.Foo,
      match: () => 1,
      meta: blankNode(),
    }
    const barEditor = {
      term: ex.Bar,
      match: () => 1,
      meta: blankNode(),
    }
    const before = testState({
      singleEditors: [fooEditor, barEditor],
    })

    // when
    const dataset = $rdf.dataset([
      quad(ex.Foo, rdfs.label, literal('Foo editor')),
      quad(ex.Bar, rdfs.label, literal('Bar editor')),
    ])
    const after = addMetadata(before, dataset)

    // expect
    expect(after.allEditors[ex.Foo.value]?.meta?.out(rdfs.label)).to.deep.eq(literal('Foo editor'))
    expect(after.allEditors[ex.Bar.value]?.meta?.out(rdfs.label)).to.deep.eq(literal('Bar editor'))
    expect(after.singleEditors[ex.Foo.value]?.meta?.out(rdfs.label)).to.deep.eq(literal('Foo editor'))
    expect(after.singleEditors[ex.Bar.value]?.meta?.out(rdfs.label)).to.deep.eq(literal('Bar editor'))
  })
})
