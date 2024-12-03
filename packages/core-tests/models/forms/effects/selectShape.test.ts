import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import type { sinon } from '@shaperone/testing'
import type { NodeShape } from '@rdfine/shacl'
import { testStore } from '@shaperone/testing/models/form.js'
import { selectShape } from '@hydrofoil/shaperone-core/models/forms/effects/selectShape.js'
import type { Store } from '@hydrofoil/shaperone-core/state'

describe('models/forms/effects/selectShape', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('creates state with selected shape', () => {
    // given
    const shape = {} as NodeShape
    const focusNode = $rdf.clownface().blankNode()

    // when
    selectShape(store)({
      focusNode,
      shape,
    })

    // then
    const dispatch = store.getDispatch()
    const [call] = (dispatch.form.createFocusNodeState as sinon.SinonStub).getCalls()
    expect(call.lastArg.shape === shape)
  })
})
