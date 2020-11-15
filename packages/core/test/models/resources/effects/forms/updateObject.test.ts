import { describe, it } from 'mocha'
import { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { schema } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import updateObject from '../../../../../models/resources/effects/forms/updateObject'
import { Store } from '../../../../../state'
import { testStore } from '../../../forms/util'
import { propertyShape } from '../../../../util'

describe('models/resources/effects/forms/updateObject', () => {
  let store: Store
  let graph: AnyPointer
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore());
    ({ graph } = store.getState().resources.get(form)!)
  })

  it('removes old value from graph', () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.age, ['5', '15'])
    const object = {
      object: focusNode.literal('5'),
    }
    const newValue = $rdf.literal('10')
    const property = propertyShape({
      path: schema.age,
    })

    // when
    updateObject(store)({
      form,
      focusNode,
      object,
      newValue,
      property,
    })

    // then
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('10'),
      $rdf.literal('15'),
    ])
  })

  it('adds new value if old was undefined', () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.age, ['5', '15'])
    const object = {
      object: undefined,
    }
    const newValue = $rdf.literal('10')
    const property = propertyShape({
      path: schema.age,
    })

    // when
    updateObject(store)({
      form,
      focusNode,
      newValue,
      property,
      object,
    })

    // then
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('5'),
      $rdf.literal('10'),
      $rdf.literal('15'),
    ])
  })
})
