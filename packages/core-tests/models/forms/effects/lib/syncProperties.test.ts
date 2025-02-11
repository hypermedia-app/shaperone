import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import type { sinon } from '@shaperone/testing'
import { dash, foaf, schema, sh } from '@tpluscode/rdf-ns-builders'
import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form.js'
import type { Dispatch, Store } from '@hydrofoil/shaperone-core/state'
import { syncProperties } from '@hydrofoil/shaperone-core/models/forms/effects/lib/syncProperties.js'
import type { EditorsState } from '@hydrofoil/shaperone-core/models/editors'
import type { State } from '@hydrofoil/shaperone-core/models/forms'
import { nodeShape, propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/lib/syncProperties', () => {
  let store: Store
  let editors: EditorsState
  let form: State
  let dispatch: Dispatch

  beforeEach(() => {
    store = testStore();
    ({ form, editors } = store.getState())
    dispatch = store.getDispatch()
  })

  it('syncs property which is dash:hidden and has sh:equals to given property', () => {
    // given
    const focusNode = $rdf.clownface().blankNode()
    const shapesGraph = $rdf.clownface()
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

    store.getState().form.focusNodes = testFocusNodeState(focusNode, {
      shape: nodeShape(shapesGraph.blankNode()),
      properties: [
        testPropertyState(property.pointer),
        testPropertyState(synced1.pointer),
        testPropertyState(synced2.pointer),
      ],
    })

    // when
    syncProperties({ form, editors, dispatch, property, focusNode })

    // then
    const spy = dispatch.form.setPropertyObjects as sinon.SinonSpy
    expect(spy).to.have.been.calledTwice
    expect(spy.getCalls().map(call => call.lastArg.property.id)).to.deep.equal([
      synced1.id,
      synced2.id,
    ])
  })
})
