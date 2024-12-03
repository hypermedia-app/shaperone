import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { testStore, testFocusNodeState } from '@shaperone/testing/models/form.js'
import { sinon } from '@shaperone/testing'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { validate } from '@hydrofoil/shaperone-core/models/forms/effects/validate.js'

describe('@hydrofoil/shaperone-core/models/forms/effects/validate', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('calls validator and dispatches report update', async () => {
    // given
    const focusNode = $rdf.clownface().namedNode('foo')
    store.getState().form.focusNodes = testFocusNodeState(focusNode)
    const validationResult = {
      term: $rdf.blankNode(),
      dataset: $rdf.dataset(),
    }
    store.getState().validation.validator = sinon.stub().resolves(validationResult)

    // when
    await validate(store)()

    // then
    const dispatch = store.getDispatch()
    expect(store.getState().validation.validator).to.have.been.called
    expect(dispatch.form.validationReport).to.have.been.called
  })
})
