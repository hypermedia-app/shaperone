import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import type { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { replaceObjects } from '@hydrofoil/shaperone-core/models/forms/effects/replaceObjects.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/replaceObjects', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('dispatches setPropertyObjects with pointers from resource graph', () => {
    // given
    const { dataset } = store.getState().resources.graph!
    const property = propertyShape()
    const focusNode = $rdf.clownface().blankNode()
    const terms = [
      $rdf.literal('a'),
      $rdf.literal('b'),
      $rdf.literal('c'),
    ]

    // when
    replaceObjects(store)({
      property,
      focusNode,
      terms,
    })

    // then
    const dispatch = store.getDispatch()
    const [call] = (dispatch.form.setPropertyObjects as sinon.SinonStub).getCalls()
    expect(call.lastArg.objects.dataset === dataset)
  })
})
