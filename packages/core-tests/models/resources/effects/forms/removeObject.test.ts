import { describe, it } from 'mocha'
import { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { schema } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form'
import removeObject from '@hydrofoil/shaperone-core/models/resources/effects/forms/removeObject'
import { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util'
import { unit } from '@tpluscode/rdf-ns-builders/strict'

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

  it("removes object's value from dataset, including subgraph", () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.weight, (weight) => {
        weight.addOut(schema.value, 2000)
        weight.addOut(schema.unitCode, unit.KiloGM)
      })
    const object = {
      object: focusNode.out(schema.weight).toArray().shift(),
    }
    const property = propertyShape({
      path: schema.weight,
    })

    // when
    removeObject(store)({
      form,
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.dataset.size).to.eq(0)
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
