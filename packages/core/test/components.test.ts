import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import $rdf from 'rdf-ext'
import { dash, rdf, owl } from '@tpluscode/rdf-ns-builders'
import { enumSelect, instancesSelect } from '../components'
import { propertyShape } from './util'

describe('components', () => {
  describe('instancesSelect', () => {
    it('is dash:EnumSelectEditor', () => {
      expect(enumSelect.editor).to.deep.eq(dash.EnumSelectEditor)
    })

    it('sets objects of sh:in to component state', () => {
      // given
      const updateComponentState = sinon.spy()
      const property = propertyShape({
        in: [$rdf.literal('foo'), $rdf.blankNode('bar'), $rdf.namedNode('baz')],
      })

      // when
      enumSelect.loadChoices(property, updateComponentState)

      // then
      expect(updateComponentState.firstCall.lastArg).to.containSubset({
        choices: [{
          term: $rdf.literal('foo'),
        }, {
          term: $rdf.blankNode('bar'),
        }, {
          term: $rdf.namedNode('baz'),
        }],
      })
    })
  })

  describe('enumSelect', () => {
    it('is dash:InstancesSelectEditor', () => {
      expect(instancesSelect.editor).to.deep.eq(dash.InstancesSelectEditor)
    })

    it('sets instances of sh:class selected from property graph', () => {
      // given
      const updateComponentState = sinon.spy()
      const property = propertyShape({
        class: owl.Thing,
      })
      property.pointer.namedNode('foo').addOut(rdf.type, owl.Thing)
      property.pointer.namedNode('bar').addOut(rdf.type, owl.Nothing)
      property.pointer.namedNode('baz').addOut(rdf.type, owl.Thing)

      // when
      instancesSelect.loadChoices(property, updateComponentState)

      // then
      expect(updateComponentState.firstCall.lastArg).to.containSubset({
        instances: [{
          term: $rdf.namedNode('foo'),
        }, {
          term: $rdf.namedNode('baz'),
        }],
      })
    })
  })
})
