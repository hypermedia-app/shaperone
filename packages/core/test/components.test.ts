import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { dash, rdf, owl, rdfs, schema, foaf } from '@tpluscode/rdf-ns-builders'
import clownface, { GraphPointer } from 'clownface'
import promise from 'promise-the-world'
import { sinon } from '@shaperone/testing'
import { BlankNode } from 'rdf-js'
import { enumSelect, InstancesSelect, instancesSelect, EnumSelect } from '../components'
import { propertyShape } from './util'
import { testObjectState, testPropertyState } from './models/forms/util'
import { FormSettings, PropertyObjectState, PropertyState } from '../models/forms'

describe('components', () => {
  describe('enumSelect', () => {
    let form: FormSettings
    let property: PropertyState
    let value: PropertyObjectState<EnumSelect>
    let updateComponentState: sinon.SinonSpy
    let focusNode: GraphPointer<BlankNode>

    beforeEach(() => {
      form = {
        labelProperties: [rdfs.label],
        languages: [],
        shouldEnableEditorChoice() {
          return true
        },
      }
      updateComponentState = sinon.spy()
      focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
      property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
      value = testObjectState(clownface({ dataset: $rdf.dataset() }).blankNode())
    })

    it('is dash:EnumSelectEditor', () => {
      expect(enumSelect.editor).to.deep.eq(dash.EnumSelectEditor)
    })

    describe('.init', () => {
      it('returns true if already has choices', () => {
        // given
        const graph = clownface({ dataset: $rdf.dataset() })

        // when
        const result = enumSelect.init?.(<any>{
          value: {
            componentState: {
              choices: [
                [graph.literal('foo'), 'foo'],
                [graph.literal('bar'), 'bar'],
              ],
            },
          },
        })

        // then
        expect(result).to.be.true
      })

      it('returns false if loading', () => {
        // when
        const result = enumSelect.init?.(<any>{
          value: {
            componentState: {
              loading: true,
            },
          },
        })

        // then
        expect(result).to.be.false
      })

      it('sets choices with labels to state', async () => {
        // given
        const deferred = promise.defer()
        enumSelect.loadChoices = async () => {
          deferred.resolve('')
          const instances = clownface({ dataset: $rdf.dataset() })
          return [
            instances.node(rdfs.Class).addOut(rdfs.label, 'Class'),
            instances.node(schema.Person).addOut(rdfs.label, 'Person'),
            instances.node(foaf.Person).addOut(rdfs.label, 'Also Person'),
            instances.node(schema.Organization).addOut(rdfs.label, 'Org'),
          ]
        }

        // when
        enumSelect.init?.({
          form,
          value,
          updateComponentState,
          focusNode,
          property,
        })
        await deferred

        // then
        expect(updateComponentState).to.have.been.calledWith(sinon.match({
          choices: sinon.match.array,
          ready: true,
          loading: false,
        }))
        expect(updateComponentState.lastCall.lastArg.choices.map(([, label]: [any, string]) => label)).to.contain.ordered.members([
          'Also Person',
          'Class',
          'Org',
          'Person',
        ])
      })
    })

    it('sets objects of sh:in to component state', async () => {
      // given
      const focusNode = clownface({ dataset: $rdf.dataset() }).namedNode('fn')
      const property = propertyShape({
        in: [$rdf.literal('foo'), $rdf.blankNode('bar'), $rdf.namedNode('baz')],
      })

      // when
      const choices = await enumSelect.loadChoices({ focusNode, property })

      // then
      expect(choices).to.containSubset([{
        term: $rdf.literal('foo'),
      }, {
        term: $rdf.blankNode('bar'),
      }, {
        term: $rdf.namedNode('baz'),
      }])
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
    let form: FormSettings
    let property: PropertyState
    let value: PropertyObjectState<InstancesSelect>
    let updateComponentState: sinon.SinonSpy
    let focusNode: GraphPointer<BlankNode>

    beforeEach(() => {
      form = {
        labelProperties: [rdfs.label],
        languages: [],
        shouldEnableEditorChoice() {
          return true
        },
      }
      updateComponentState = sinon.spy()
      focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
      property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
      value = testObjectState(clownface({ dataset: $rdf.dataset() }).blankNode())
    })

    it('is dash:InstancesSelectEditor', () => {
      expect(instancesSelect.editor).to.deep.eq(dash.InstancesSelectEditor)
    })

    describe('.init', () => {
      it('returns true if already has choices', () => {
        // given
        const graph = clownface({ dataset: $rdf.dataset() })
        value.componentState.instances = [
          [graph.literal('foo'), 'foo'],
          [graph.literal('bar'), 'bar'],
        ]

        // when
        const result = instancesSelect.init?.(<any>{ value })

        // then
        expect(result).to.be.true
      })

      it('returns false if loading', () => {
        // given
        value.componentState.loading = true

        // when
        const result = instancesSelect.init?.(<any>{
          value,
        })

        // then
        expect(result).to.be.false
      })

      it('sets instances with labels to state', async () => {
        // given
        const deferred = promise.defer()
        instancesSelect.loadChoices = async () => {
          deferred.resolve('')
          const instances = clownface({ dataset: $rdf.dataset() })
          return [
            instances.node(rdfs.Class).addOut(rdfs.label, 'Class'),
            instances.node(schema.Person).addOut(rdfs.label, 'Person'),
            instances.node(foaf.Person).addOut(rdfs.label, 'Also Person'),
            instances.node(schema.Organization).addOut(rdfs.label, 'Org'),
          ]
        }

        // when
        instancesSelect.init?.({
          form,
          value,
          updateComponentState,
          focusNode,
          property,
        })
        await deferred

        // then
        expect(updateComponentState).to.have.been.calledWith(sinon.match({
          instances: sinon.match.array,
          ready: true,
          loading: false,
        }))
        expect(updateComponentState.lastCall.lastArg.instances.map(([, label]: [any, string]) => label)).to.contain.ordered.members([
          'Also Person',
          'Class',
          'Org',
          'Person',
        ])
      })
    })

    describe('.loadInstance', () => {
      it('returns pointer from the shapes graph', async () => {
        // given
        const value = clownface({ dataset: $rdf.dataset() }).namedNode('foo')

        // when
        const pointer = await instancesSelect.loadInstance({ property: property.shape, value })

        // then
        expect(pointer?.dataset).to.eq(property.shape.pointer.dataset)
        expect(pointer?.term).to.deep.eq(value.term)
      })
    })

    it('sets instances of sh:class selected from property graph', async () => {
      // given
      property.shape.class = owl.Thing as any
      property.shape.pointer.namedNode('foo').addOut(rdf.type, owl.Thing)
      property.shape.pointer.namedNode('bar').addOut(rdf.type, owl.Nothing)
      property.shape.pointer.namedNode('baz').addOut(rdf.type, owl.Thing)

      // when
      const choices = await instancesSelect.loadChoices({ property } as any)

      // then
      expect(choices).to.containSubset([{
        term: $rdf.namedNode('foo'),
      }, {
        term: $rdf.namedNode('baz'),
      }])
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
