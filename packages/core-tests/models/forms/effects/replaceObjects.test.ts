import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { replaceObjects } from '@hydrofoil/shaperone-core/models/forms/effects/replaceObjects.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/replaceObjects', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('dispatches setPropertyObjects with pointers from resource graph', () => {
    // given
    const dataset = store.getState().resources.get(form)?.graph.dataset
    const property = propertyShape()
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
    const terms = [
      $rdf.literal('a'),
      $rdf.literal('b'),
      $rdf.literal('c'),
    ]

    // when
    replaceObjects(store)({
      form,
      property,
      focusNode,
      terms,
    })

    // then
    const dispatch = store.getDispatch()
    const [call] = (dispatch.forms.setPropertyObjects as sinon.SinonStub).getCalls()
    expect(call.lastArg.objects.dataset === dataset)
  })
})
