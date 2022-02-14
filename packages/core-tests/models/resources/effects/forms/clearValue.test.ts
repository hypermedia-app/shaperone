import { describe, it } from 'mocha'
import { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { schema } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form'
import clearValue from '@hydrofoil/shaperone-core/models/resources/effects/forms/clearValue'
import { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util'

describe('models/resources/effects/forms/clearValue', () => {
  let store: Store
  let graph: AnyPointer
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore());
    ({ graph } = store.getState().resources.get(form)!)
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
      form,
      focusNode,
      object,
      property,
    })

    // then
    expect(focusNode.dataset.size).to.eq(0)
  })
})
