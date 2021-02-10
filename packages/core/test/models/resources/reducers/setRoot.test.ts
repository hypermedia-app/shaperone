import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import ns from '@rdf-esm/namespace'
import { testStore } from '@shaperone/testing/models/form'
import { setRoot } from '../../../../models/resources/reducers/setRoot'

const ex = ns('http://example.com/')

describe('core/models/resources/reducers/setRoot', () => {
  it('sets dataset to state', () => {
    // given
    const dataset = $rdf.dataset()
    const graph = cf({ dataset })
    const { form, store } = testStore()

    // when
    const after = setRoot(store.getState().resources, {
      form,
      rootPointer: graph.node(ex.Foo),
    })

    // then
    expect(after.get(form)?.graph === graph)
  })
})
