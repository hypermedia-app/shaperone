import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import $rdf from 'rdf-ext'
import { dash, rdf, owl, rdfs } from '@tpluscode/rdf-ns-builders'
import clownface from 'clownface'
import { enumSelect, instancesSelect } from '../components'
import { propertyShape } from './util'

describe('components', () => {
  describe('enumSelect', () => {
    it('is dash:EnumSelectEditor', () => {
      expect(enumSelect.editor).to.deep.eq(dash.EnumSelectEditor)
    })

    it('sets objects of sh:in to component state', () => {
      // given
      const focusNode = clownface({ dataset: $rdf.dataset() }).namedNode('fn')
      const updateComponentState = sinon.spy()
      const property = propertyShape({
        in: [$rdf.literal('foo'), $rdf.blankNode('bar'), $rdf.namedNode('baz')],
      })

      // when
      enumSelect.loadChoices({ focusNode, property, updateComponentState, componentState: {} })

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

    it('displays label in desired language', () => {
      // given
      const choice = clownface({ dataset: $rdf.dataset() })
        .blankNode()
        .addOut(rdfs.label, $rdf.literal('foo'))
        .addOut(rdfs.label, $rdf.literal('le foo', 'fr'))
        .addOut(rdfs.label, $rdf.literal('das Foo', 'de'))

      // when
      const label = enumSelect.label(choice, {
        languages: ['fr'],
        labelProperties: [rdfs.label],
      })

      // then
      expect(label).to.eq('le foo')
    })

    it('displays plain label if not found in desired language', () => {
      // given
      const choice = clownface({ dataset: $rdf.dataset() })
        .blankNode()
        .addOut(rdfs.label, $rdf.literal('foo'))
        .addOut(rdfs.label, $rdf.literal('le foo', 'fr'))
        .addOut(rdfs.label, $rdf.literal('das Foo', 'de'))

      // when
      const label = enumSelect.label(choice, {
        languages: ['en'],
        labelProperties: [rdfs.label],
      })

      // then
      expect(label).to.eq('foo')
    })
  })

  describe('instancesSelect', () => {
    it('is dash:InstancesSelectEditor', () => {
      expect(instancesSelect.editor).to.deep.eq(dash.InstancesSelectEditor)
    })

    it('sets instances of sh:class selected from property graph', () => {
      // given
      const focusNode = clownface({ dataset: $rdf.dataset() }).namedNode('fn')
      const updateComponentState = sinon.spy()
      const property = propertyShape({
        class: owl.Thing,
      })
      property.pointer.namedNode('foo').addOut(rdf.type, owl.Thing)
      property.pointer.namedNode('bar').addOut(rdf.type, owl.Nothing)
      property.pointer.namedNode('baz').addOut(rdf.type, owl.Thing)

      // when
      instancesSelect.loadChoices({ focusNode, property, updateComponentState, componentState: {} })

      // then
      expect(updateComponentState.firstCall.lastArg).to.containSubset({
        instances: [{
          term: $rdf.namedNode('foo'),
        }, {
          term: $rdf.namedNode('baz'),
        }],
      })
    })

    it('displays label in desired language', () => {
      // given
      const choice = clownface({ dataset: $rdf.dataset() })
        .blankNode()
        .addOut(rdfs.label, $rdf.literal('foo'))
        .addOut(rdfs.label, $rdf.literal('le foo', 'fr'))
        .addOut(rdfs.label, $rdf.literal('das Foo', 'de'))

      // when
      const label = instancesSelect.label(choice, {
        languages: ['fr'],
        labelProperties: [rdfs.label],
      })

      // then
      expect(label).to.eq('le foo')
    })

    it('displays plain label if not found in desired language', () => {
      // given
      const choice = clownface({ dataset: $rdf.dataset() })
        .blankNode()
        .addOut(rdfs.label, $rdf.literal('foo'))
        .addOut(rdfs.label, $rdf.literal('le foo', 'fr'))
        .addOut(rdfs.label, $rdf.literal('das Foo', 'de'))

      // when
      const label = instancesSelect.label(choice, {
        languages: ['en'],
        labelProperties: [rdfs.label],
      })

      // then
      expect(label).to.eq('foo')
    })
  })
})
