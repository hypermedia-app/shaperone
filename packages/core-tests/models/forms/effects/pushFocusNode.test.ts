import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { pushFocusNode } from '@hydrofoil/shaperone-core/models/forms/effects/pushFocusNode.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/pushFocusNode', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('uses sh:node as preferred shape', () => {
    // given
    const property = propertyShape({
      node: {
        id: $rdf.namedNode('preferredShape'),
      },
    })
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()

    // when
    pushFocusNode(store)({
      form,
      property,
      focusNode,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
      shape: {
        id: $rdf.namedNode('preferredShape'),
      },
    }))
  })

  it('appends to focus node stack', () => {
    // given
    const property = propertyShape()
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
    store.getState().editors.matchSingleEditors = () => []

    // when
    pushFocusNode(store)({
      form,
      property,
      focusNode,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
      appendToStack: true,
    }))
  })
})
