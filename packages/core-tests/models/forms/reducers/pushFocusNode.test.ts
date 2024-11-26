import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { pushFocusNode } from '@hydrofoil/shaperone-core/models/forms/effects/pushFocusNode.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/forms/reducers/pushFocusNode', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('dispatches initialization of new node state', () => {
    // given
    const graph = $rdf.clownface()
    const property = propertyShape(graph.namedNode(ex.propertyShape))

    // when
    pushFocusNode(store)({
      form,
      focusNode: graph.node(ex.FocusNode),
      property,
    })

    // then
    expect(store.getDispatch().forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
      appendToStack: true,
      form,
    }))
  })
})
