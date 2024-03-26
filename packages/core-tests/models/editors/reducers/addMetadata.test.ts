import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@zazuko/env/web.js'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { testEditorsState as testState } from '@shaperone/testing/models/editors.js'
import { addMetadata } from '@hydrofoil/shaperone-core/models/editors/reducers/addMetadata.js'

const ex = $rdf.namespace('http://example.com/')

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
      $rdf.quad(ex.Bar, rdf.type, dash.Editor),
    ])
    const after = addMetadata(before, () => dataset)

    // then
    expect(after.metadata.dataset).to.have.property('size', 2)
  })

  it('updates existing editors', () => {
    // given
    const fooEditor = {
      term: ex.Foo,
      match: () => 1,
    }
    const barEditor = {
      term: ex.Bar,
      match: () => 1,
    }
    const before = testState({
      singleEditors: [fooEditor, barEditor],
    })

    // when
    const dataset = $rdf.dataset([
      $rdf.quad(ex.Foo, rdfs.label, $rdf.literal('Foo editor')),
      $rdf.quad(ex.Bar, rdfs.label, $rdf.literal('Bar editor')),
    ])
    const after = addMetadata(before, () => dataset)

    // expect
    expect(after.allEditors[ex.Foo.value]?.meta?.out(rdfs.label).value).to.eq('Foo editor')
    expect(after.allEditors[ex.Bar.value]?.meta?.out(rdfs.label).value).to.eq('Bar editor')
    expect(after.singleEditors[ex.Foo.value]?.meta?.out(rdfs.label).value).to.eq('Foo editor')
    expect(after.singleEditors[ex.Bar.value]?.meta?.out(rdfs.label).value).to.eq('Bar editor')
  })
})
