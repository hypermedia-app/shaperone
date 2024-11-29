import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { dash, schema, sh } from '@tpluscode/rdf-ns-builders'
import { testStore, testFocusNodeState, testPropertyState } from '@shaperone/testing/models/form.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { setObjectValue } from '@hydrofoil/shaperone-core/models/forms/effects/setObjectValue.js'
import { nodeShape, propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/setObjectValue', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
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
    store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
      shape: nodeShape(shapesGraph.blankNode()),
      properties: [testPropertyState(property.pointer), testPropertyState(synced.pointer)],
    })

    // when
    setObjectValue(store)({
      form,
      focusNode,
      property,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.setPropertyObjects).to.have.been.called
  })
})
