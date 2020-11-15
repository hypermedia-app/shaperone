import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { NodeShape } from '@rdfine/shacl'
import { selectShape } from '../../../../models/forms/effects/selectShape'
import { Store } from '../../../../state'
import { testStore } from '../util'

describe('models/forms/effects/selectShape', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('creates state with selected shape', () => {
    // given
    const shape = {} as NodeShape
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()

    // when
    selectShape(store)({
      form,
      focusNode,
      shape,
    })

    // then
    const dispatch = store.getDispatch()
    const [call] = (dispatch.forms.createFocusNodeState as sinon.SinonStub).getCalls()
    expect(call.lastArg.shape === shape)
  })
})
