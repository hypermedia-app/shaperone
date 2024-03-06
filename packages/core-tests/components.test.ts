import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { dash, rdf, owl, rdfs, schema, foaf } from '@tpluscode/rdf-ns-builders'
import type { GraphPointer } from 'clownface'
import promise from 'promise-the-world'
import { sinon } from '@shaperone/testing'
import type { BlankNode } from '@rdfjs/types'
import { objectRenderer } from '@shaperone/testing/renderer.js'
import { testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import { enumSelect, InstancesSelect, instancesSelect, EnumSelect } from '@hydrofoil/shaperone-core/components.js'
import { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { propertyShape } from '@shaperone/testing/util.js'
import type { SinonStubbedInstance } from 'sinon'
import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components/index.js'

describe('components', () => {
  describe('enumSelect', () => {
    let form: FormSettings
    let property: PropertyState
    let value: PropertyObjectState<EnumSelect>
    let updateComponentState: sinon.SinonSpy
    let focusNode: GraphPointer<BlankNode>
    let actions: SinonStubbedInstance<SingleEditorActions>

    beforeEach(() => {
      form = {
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice() {
          return true
        },
      }
      updateComponentState = sinon.spy()
      focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      property = testPropertyState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
      value = testObjectState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
    })

    it('is dash:EnumSelectEditor', () => {
      expect(enumSelect.editor).to.deep.eq(dash.EnumSelectEditor)
    })

    describe('.init', () => {
      it('returns true if already has choices', () => {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })

        // when
        const result = enumSelect.init?.(<any>{
          componentState: {
            choices: [
              [graph.literal('foo'), 'foo'],
              [graph.literal('bar'), 'bar'],
            ],
          },
        }, actions)

        // then
        expect(result).to.be.true
      })

      it('returns false if loading', () => {
        // when
        const result = enumSelect.init?.(<any>{
          componentState: {
            loading: true,
          },
        }, actions)

        // then
        expect(result).to.be.false
      })

      it('sets choices with labels to state', async () => {
        // given
        const deferred = promise.defer()
        enumSelect.loadChoices = async () => {
          deferred.resolve('')
          const instances = $rdf.clownface({ dataset: $rdf.dataset() })
          return [
            instances.node(rdfs.Class).addOut(rdfs.label, 'Class'),
            instances.node(schema.Person).addOut(rdfs.label, 'Person'),
            instances.node(foaf.Person).addOut(rdfs.label, 'Also Person'),
            instances.node(schema.Organization).addOut(rdfs.label, 'Org'),
          ]
        }
        const renderer = objectRenderer({
          focusNode,
          property,
          object: value,
        })

        // when
        enumSelect.init?.({
          env: $rdf,
          form,
          value,
          componentState: {},
          updateComponentState,
          focusNode,
          property,
          renderer,
        }, actions)
        await deferred

        // then
        expect(updateComponentState).to.have.been.calledWith(sinon.match({
          choices: sinon.match.array,
          ready: true,
          loading: false,
        }))
        expect(updateComponentState.lastCall.lastArg.choices.map((p: GraphPointer) => p.term)).to.contain.deep.ordered.members([
          foaf.Person,
          rdfs.Class,
          schema.Organization,
          schema.Person,
        ])
      })
    })

    it('sets objects of sh:in to component state', async () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).namedNode('fn')
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
  })

  describe('instancesSelect', () => {
    let form: FormSettings
    let property: PropertyState
    let value: PropertyObjectState<InstancesSelect>
    let updateComponentState: sinon.SinonSpy
    let focusNode: GraphPointer<BlankNode>
    let actions: SinonStubbedInstance<SingleEditorActions>

    beforeEach(() => {
      form = {
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice() {
          return true
        },
      }
      updateComponentState = sinon.spy()
      focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      property = testPropertyState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
      value = testObjectState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
    })

    it('is dash:InstancesSelectEditor', () => {
      expect(instancesSelect.editor).to.deep.eq(dash.InstancesSelectEditor)
    })

    describe('.init', () => {
      it('returns true if already has choices', () => {
        // given
        const graph = $rdf.clownface({ dataset: $rdf.dataset() })
        const componentState = {
          instances: [
            graph.literal('foo').addOut(rdfs.label, 'foo'),
            graph.literal('bar').addOut(rdfs.label, 'bar'),
          ],
        }

        // when
        const result = instancesSelect.init?.(<any>{ value, componentState }, actions)

        // then
        expect(result).to.be.true
      })

      it('returns false if loading', () => {
        // given
        const componentState = { loading: true }

        // when
        const result = instancesSelect.init?.(<any>{
          value,
          componentState,
        }, actions)

        // then
        expect(result).to.be.false
      })

      it('sets instances with labels to state', async () => {
        // given
        const deferred = promise.defer()
        instancesSelect.loadChoices = async () => {
          deferred.resolve('')
          const instances = $rdf.clownface({ dataset: $rdf.dataset() })
          return [
            instances.node(rdfs.Class).addOut(rdfs.label, 'Class'),
            instances.node(schema.Person).addOut(rdfs.label, 'Person'),
            instances.node(foaf.Person).addOut(rdfs.label, 'Also Person'),
            instances.node(schema.Organization).addOut(rdfs.label, 'Org'),
          ]
        }
        const renderer = objectRenderer({
          focusNode,
          property,
          object: value,
        })

        // when
        instancesSelect.init?.({
          env: $rdf,
          form,
          value,
          updateComponentState,
          componentState: {},
          focusNode,
          property,
          renderer,
        }, actions)
        await deferred

        // then
        expect(updateComponentState).to.have.been.calledWith(sinon.match({
          instances: sinon.match.array,
          ready: true,
          loading: false,
        }))
        expect(updateComponentState.lastCall.lastArg.instances.map((p: GraphPointer) => p.term)).to.contain.deep.ordered.members([
          foaf.Person,
          rdfs.Class,
          schema.Organization,
          schema.Person,
        ])
      })
    })

    describe('.loadInstance', () => {
      it('returns pointer from the shapes graph', async () => {
        // given
        const value = $rdf.clownface({ dataset: $rdf.dataset() }).namedNode('foo')

        // when
        const pointer = await instancesSelect.loadInstance({ env: $rdf, property: property.shape, value })

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
  })
})
