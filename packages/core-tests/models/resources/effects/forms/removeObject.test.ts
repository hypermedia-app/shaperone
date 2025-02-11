import { describe, it } from 'mocha'
import type { AnyPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import { unit } from '@tpluscode/rdf-ns-builders'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form.js'
import removeObject from '@hydrofoil/shaperone-core/models/resources/effects/forms/removeObject.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/resources/effects/forms/removeObject', () => {
  let store: Store
  let graph: AnyPointer

  beforeEach(() => {
    store = testStore()
    graph = store.getState().resources.graph!
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
