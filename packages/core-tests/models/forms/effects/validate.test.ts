import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { testStore, testFocusNodeState } from '@shaperone/testing/models/form.js'
import { sinon } from '@shaperone/testing'
import { Store } from '@hydrofoil/shaperone-core/state'
import { validate } from '@hydrofoil/shaperone-core/models/forms/effects/validate.js'

describe('@hydrofoil/shaperone-core/models/forms/effects/validate', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('calls validator and dispatches report update', async () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).namedNode('foo')
    store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode)
    const validationResult = {
      term: $rdf.blankNode(),
      dataset: $rdf.dataset(),
    }
    store.getState().validation.validator = sinon.stub().resolves(validationResult)

    // when
    await validate(store)({
      form,
    })

    // then
    const dispatch = store.getDispatch()
    expect(store.getState().validation.validator).to.have.been.called
    expect(dispatch.forms.validationReport).to.have.been.called
  })
})
