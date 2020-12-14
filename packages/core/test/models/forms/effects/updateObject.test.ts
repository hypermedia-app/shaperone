import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { dash, schema, sh } from '@tpluscode/rdf-ns-builders'
import { Store } from '../../../../state'
import { testStore, testFocusNodeState, testPropertyState } from '../util'
import { updateObject } from '../../../../models/forms/effects/updateObject'
import { nodeShape, propertyShape } from '../../../util'

describe('models/forms/effects/updateObject', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('dispatches update of property linked by sh:equals', () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).namedNode('foo')
    const shapesGraph = cf({ dataset: $rdf.dataset() })
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
    updateObject(store)({
      form,
      focusNode,
      property,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.setPropertyObjects).to.have.been.called
  })
})
