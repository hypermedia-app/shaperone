import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { replaceObjects } from '../../../../models/forms/effects/replaceObjects'
import { Store } from '../../../../state'
import { testStore } from '../util'
import { propertyShape } from '../../../util'

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
