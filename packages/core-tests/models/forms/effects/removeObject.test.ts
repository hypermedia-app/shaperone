import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { dash, schema, sh } from '@tpluscode/rdf-ns-builders'
import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { removeObject } from '@hydrofoil/shaperone-core/models/forms/effects/removeObject.js'
import { nodeShape, propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/removeObject', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('dispatches update of property linked by sh:equals', () => {
    // given
    const focusNode = $rdf.clownface().namedNode('foo')
    const shapesGraph = $rdf.clownface()
    const property = propertyShape(shapesGraph.blankNode(), {
      path: schema.name,
    })
    const synced = propertyShape(shapesGraph.blankNode(), {
      [dash.hidden.value]: true,
      path: schema.givenName,
      [sh.equals.value]: schema.name,
    })
    store.getState().form.focusNodes = testFocusNodeState(focusNode, {
      shape: nodeShape(shapesGraph.blankNode()),
      properties: [testPropertyState(property.pointer), testPropertyState(synced.pointer)],
    })

    // when
    removeObject(store)({
      focusNode,
      property,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.form.setPropertyObjects).to.have.been.called
  })
})
