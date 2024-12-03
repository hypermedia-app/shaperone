import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { pushFocusNode } from '@hydrofoil/shaperone-core/models/forms/effects/pushFocusNode.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/pushFocusNode', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('uses sh:node as preferred shape', () => {
    // given
    const property = propertyShape({
      node: {
        id: $rdf.namedNode('preferredShape'),
      },
    })
    const focusNode = $rdf.clownface().blankNode()

    // when
    pushFocusNode(store)({
      property,
      focusNode,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.form.createFocusNodeState).to.have.been.calledWith(sinon.match({
      shape: {
        id: $rdf.namedNode('preferredShape'),
      },
    }))
  })

  it('appends to focus node stack', () => {
    // given
    const property = propertyShape()
    const focusNode = $rdf.clownface().blankNode()
    store.getState().editors.matchSingleEditors = () => []

    // when
    pushFocusNode(store)({
      property,
      focusNode,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.form.createFocusNodeState).to.have.been.calledWith(sinon.match({
      appendToStack: true,
    }))
  })
})
