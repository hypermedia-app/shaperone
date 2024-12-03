import { describe, it } from 'mocha'
import type { AnyPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form.js'
import clearValue from '@hydrofoil/shaperone-core/models/resources/effects/forms/clearValue.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'

describe('models/resources/effects/forms/clearValue', () => {
  let store: Store
  let graph: AnyPointer

  beforeEach(() => {
    store = testStore()
    graph = store.getState().resources.graph!
  })

  it('removes value from graph', () => {
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
    clearValue(store)({
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('15'),
    ])
  })

  it('removes unique subgraph from graph', () => {
    // given
    const location = graph.blankNode().addOut(schema.streetAddress, 'Wisteria Lane')
    const focusNode = graph.blankNode()
      .addOut(schema.employmentUnit, (empl) => {
        empl.addOut(schema.location, location)
      })
    const object = {
      object: focusNode.out(schema.employmentUnit).toArray().shift(),
    }
    const property = propertyShape({
      path: schema.employmentUnit,
    })

    // when
    clearValue(store)({
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.dataset.size).to.eq(0)
  })
})
