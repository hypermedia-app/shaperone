import { describe, it } from 'mocha'
import { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { schema } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import removeObject from '../../../../../models/resources/effects/forms/removeObject'
import { Store } from '../../../../../state'
import { testStore } from '../../../forms/util'
import { propertyShape } from '../../../../util'

describe('models/resources/effects/forms/removeObject', () => {
  let store: Store
  let graph: AnyPointer
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore());
    ({ graph } = store.getState().resources.get(form)!)
  })

  it("removes object's value from dataset", () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.age, ['5', '15'])
    const object = {
      object: focusNode.literal('5'),
    }
    const property = propertyShape({
      path: schema.age,
    })

    // when
    removeObject(store)({
      form,
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('15'),
    ])
  })

  it('does nothing is object state had no value', () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.age, ['5', '15'])
    const object = {}
    const property = propertyShape({
      path: schema.age,
    })

    // when
    removeObject(store)({
      form,
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('15'),
      $rdf.literal('5'),
    ])
  })
})
