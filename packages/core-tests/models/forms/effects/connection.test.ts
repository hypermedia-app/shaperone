import { describe, it } from 'mocha'
import { expect } from 'chai'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { testStore } from '@shaperone/testing/models/form.js'
import { connect } from '@hydrofoil/shaperone-core/models/forms/effects/connection.js'
import { Store } from '@hydrofoil/shaperone-core/state'

describe('models/forms/effects/connect', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('initializes state if there was already a root resource pointer', () => {
    // given
    const focusNode = clownface({ dataset: $rdf.dataset() }).namedNode('foo')
    store.getState().resources.get(form)!.rootPointer = focusNode

    // when
    connect(store)({ form })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.createFocusNodeState).to.have.been.called
  })
})
