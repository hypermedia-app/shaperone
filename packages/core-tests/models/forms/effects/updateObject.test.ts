import { describe, it } from 'mocha'
import { expect } from 'chai'
import type * as sinon from 'sinon'
import $rdf from '@shaperone/testing/env.js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { testStore, testObjectState } from '@shaperone/testing/models/form.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { updateObject } from '@hydrofoil/shaperone-core/models/forms/effects/updateObject.js'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/forms/effects/updateObject', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('forwards term value directly to setObject reducer', () => {
    // given
    const newValue = $rdf.literal('bar')
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).namedNode('foo')
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(shapesGraph.blankNode(), {
      path: schema.name,
    })
    const object = testObjectState()

    // when
    updateObject(store)({
      form,
      focusNode,
      property,
      object,
      newValue,
    })

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.setObjectValue).to.have.been.calledOnce
    expect(dispatch.forms.setObjectValue).to.have.been.calledWithMatch({
      newValue,
    })
  })

  it('rewrites dataset value', () => {
    // given
    const newValue = $rdf.clownface({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(schema.identifier, 'bar')
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).namedNode('foo')
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(shapesGraph.blankNode(), {
      path: schema.name,
    })
    const object = testObjectState()

    // when
    updateObject(store)({
      form,
      focusNode,
      property,
      object,
      newValue,
    })

    // then
    const setObjectValue = store.getDispatch().forms.setObjectValue as sinon.SinonSpy
    expect(setObjectValue).to.have.been.calledOnce
    expect(setObjectValue.firstCall.firstArg.newValue.value).not.to.eq(newValue.value)
  })

  it('throws if value is pointer to same dataset', () => {
    // given
    const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).namedNode('foo')
    const newValue = focusNode
      .blankNode()
      .addOut(schema.identifier, 'bar')
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(shapesGraph.blankNode(), {
      path: schema.name,
    })
    const object = testObjectState()

    // when
    expect(() => updateObject(store)({
      form,
      focusNode,
      property,
      object,
      newValue,
    })).to.throw(/unrelated/)

    // then
    const dispatch = store.getDispatch()
    expect(dispatch.forms.setObjectValue).not.to.have.been.called
  })
})
