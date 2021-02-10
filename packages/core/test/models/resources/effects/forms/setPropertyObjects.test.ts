import { describe, it } from 'mocha'
import { AnyPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { schema } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form'
import setPropertyObjects from '../../../../../models/resources/effects/forms/setPropertyObjects'
import { Store } from '../../../../../state'
import { propertyShape } from '../../../../util'

describe('models/resources/effects/forms/setPropertyObjects', () => {
  let store: Store
  let graph: AnyPointer
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore());
    ({ graph } = store.getState().resources.get(form)!)
  })

  it('removes old values from graph and inserts new', () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.age, ['5', '15'])
    const objects = graph.node([$rdf.literal('10'), $rdf.literal('20')])
    const property = propertyShape({
      path: schema.age,
    })

    // when
    setPropertyObjects(store)({
      form,
      focusNode,
      property,
      objects,
    })

    // then
    expect(focusNode.out(schema.age).values).to.have.length(2)
    expect(focusNode.out(schema.age).terms).to.deep.contain.members([
      $rdf.literal('10'),
      $rdf.literal('20'),
    ])
  })
})
