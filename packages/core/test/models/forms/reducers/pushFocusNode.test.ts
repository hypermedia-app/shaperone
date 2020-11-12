import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import * as sinon from 'sinon'
import ns from '@rdf-esm/namespace'
import { pushFocusNode } from '../../../../models/forms/effects/pushFocusNode'
import { testStore } from '../util'
import { propertyShape } from '../../../util'
import { Store } from '../../../../state'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/pushFocusNode', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('dispatches initialization of new node state', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
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
