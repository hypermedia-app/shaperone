import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { testStore } from '@shaperone/testing/models/form.js'
import { setRoot } from '@hydrofoil/shaperone-core/models/resources/reducers/setRoot.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/resources/reducers/setRoot', () => {
  it('sets dataset to state', () => {
    // given
    const dataset = $rdf.dataset()
    const graph = $rdf.clownface({ dataset })
    const store = testStore()

    // when
    const after = setRoot(store.getState().resources, {
      rootPointer: graph.node(ex.Foo),
    })

    // then
    expect(after.graph === graph)
  })
})
