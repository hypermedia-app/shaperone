import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { sinon } from '@shaperone/testing'
import { dash, foaf, schema, sh } from '@tpluscode/rdf-ns-builders'
import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form'
import { nodeShape, propertyShape } from '../../../../util'
import { Dispatch, Store } from '../../../../../state'
import { syncProperties } from '../../../../../models/forms/effects/lib/syncProperties'
import { EditorsState } from '../../../../../models/editors'
import { State } from '../../../../../models/forms'

describe('models/forms/effects/lib/syncProperties', () => {
  let store: Store
  let form: symbol
  let editors: EditorsState
  let forms: State
  let dispatch: Dispatch

  beforeEach(() => {
    ({ form, store } = testStore());
    ({ forms, editors } = store.getState())
    dispatch = store.getDispatch()
  })

  it('syncs property which is dash:hidden and has sh:equals to given property', () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
    const shapesGraph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(shapesGraph.blankNode(), {
      path: foaf.givenName,
    })
    const synced1 = propertyShape(shapesGraph.blankNode(), {
      [dash.hidden.value]: true,
      path: foaf.givenname,
      [sh.equals.value]: foaf.givenName,
    })
    const synced2 = propertyShape(shapesGraph.blankNode(), {
      [dash.hidden.value]: true,
      path: schema.givenName,
      [sh.equals.value]: foaf.givenName,
    })

    store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
      shape: nodeShape(shapesGraph.blankNode()),
      properties: [
        testPropertyState(property.pointer),
        testPropertyState(synced1.pointer),
        testPropertyState(synced2.pointer),
      ],
    })

    // when
    syncProperties({ forms, editors, form, dispatch, property, focusNode })

    // then
    const spy = dispatch.forms.setPropertyObjects as sinon.SinonSpy
    expect(spy).to.have.been.calledTwice
    expect(spy.getCalls().map(call => call.lastArg.property.id)).to.deep.equal([
      synced1.id,
      synced2.id,
    ])
  })
})
