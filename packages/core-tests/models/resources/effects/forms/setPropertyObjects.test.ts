import { describe, it } from 'mocha'
import type { AnyContext, AnyPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form.js'
import setPropertyObjects from '@hydrofoil/shaperone-core/models/resources/effects/forms/setPropertyObjects.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util.js'
import type { Dataset } from '@zazuko/env/lib/Dataset.js'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'

describe('models/resources/effects/forms/setPropertyObjects', () => {
  let store: Store
  let graph: AnyPointer<AnyContext, Dataset>

  beforeEach(() => {
    store = testStore({ factory: $rdf });
    ({ graph } = store.getState().resources as any)
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

  it('removes orphaned subgraphs', () => {
    // given
    const focusNode = graph.blankNode()
      .addOut(schema.contactPoints, graph.blankNode('a1'), (addr) => {
        addr.addOut(schema.streetAddress, 'Wisteria Lane')
      })
      .addOut(schema.contactPoints, graph.blankNode('a2'), (addr) => {
        addr.addOut(schema.streetAddress, 'Broadway')
      })
    const objects = graph.blankNode('a2')
    const property = propertyShape({
      path: schema.contactPoints,
    })

    // when
    setPropertyObjects(store)({
      focusNode,
      property,
      objects,
    })

    // then
    const expected = $rdf.clownface({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(schema.contactPoints, graph.blankNode('a2'), (addr) => {
        addr.addOut(schema.streetAddress, 'Broadway')
      })
    expect(toCanonical(focusNode.dataset)).to.eq(toCanonical(expected.dataset))
  })
})
