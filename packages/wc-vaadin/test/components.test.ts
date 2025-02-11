import { expect } from '@open-wc/testing'
import { ex, sinon } from '@shaperone/testing'
import { testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import type { GraphPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import { rdfs, schema, dcterms, hydra } from '@tpluscode/rdf-ns-builders'
import type { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { BlankNode } from '@rdfjs/types'
import type { SingleEditorActions, UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import promise from 'promise-the-world'
import type { ObjectRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { objectRenderer } from '@shaperone/testing/renderer.js'
import type { SinonStubbedInstance } from 'sinon'
import { instancesSelectEditor } from '../components.js'

describe('wc-vaadin/components', () => {
  describe('instancesSelectEditor', () => {
    describe('init', () => {
      const form: FormSettings = {
        labelProperties: [rdfs.label, schema.name, dcterms.title],
        shouldEnableEditorChoice: () => true,
      }

      let renderer: ObjectRenderer
      let focusNode: GraphPointer<BlankNode>
      let fetchedInstance: GraphPointer
      let property: PropertyState
      let value: PropertyObjectState
      let updateComponentState: UpdateComponentState
      const actions: SinonStubbedInstance<SingleEditorActions> = {} as any

      beforeEach(() => {
        focusNode = $rdf.clownface().blankNode()
        property = testPropertyState($rdf.clownface().blankNode())
        fetchedInstance = $rdf.clownface().node(ex.Foo)
        value = testObjectState(focusNode.blankNode())
        value.object = focusNode.node(ex.Foo)
        updateComponentState = sinon.spy()
        renderer = objectRenderer({
          focusNode,
          property,
          object: value,
        })
      })

      describe('.init', () => {
        it('sets loading state', () => {
          // given
          const editor = {
            ...instancesSelectEditor,
            loadInstance: sinon.stub().resolves(fetchedInstance),
          }

          // when
          editor.init?.({
            env: $rdf,
            form,
            value,
            focusNode,
            property,
            componentState: {},
            updateComponentState,
            renderer,
          }, actions)

          // then
          expect(updateComponentState).to.have.been.calledWith(sinon.match({
            loading: true,
          }))
        })

        it('returns true if state is marked ready', () => {
          // given
          const editor = {
            ...instancesSelectEditor,
            loadInstance: sinon.spy(),
          }

          // when
          const result = editor.init?.({
            env: $rdf,
            form,
            value,
            focusNode,
            property,
            componentState: {
              ready: true,
            },
            updateComponentState,
            renderer,
          }, actions)

          // then
          expect(result).to.be.true
          expect(editor.loadInstance).not.to.have.been.called
        })

        it.skip('sets ready flag if loading instance fails', async () => {
          // given
          const deferred = promise.defer()
          const editor = {
            ...instancesSelectEditor,
            loadInstance: sinon.stub().rejects(),
          }

          // when
          editor.init?.({
            env: $rdf,
            form,
            value,
            focusNode,
            property,
            componentState: {},
            updateComponentState,
            renderer,
          }, actions)
          await deferred

          // then
          expect(updateComponentState).to.have.been.calledWith(sinon.match({
            ready: true,
          }))
        })

        it('fetches named resource if it has no triples in data graph and sets its labels', async () => {
          // given
          fetchedInstance
            .addOut(rdfs.label, $rdf.literal('foo', 'de'))
            .addOut(schema.name, $rdf.literal('bar', 'en'))
            .addOut(dcterms.title, $rdf.literal('baz', 'fr'))
          const editor = {
            ...instancesSelectEditor,
            loadInstance: sinon.stub().resolves(fetchedInstance),
          }

          // when
          await editor.init?.({
            env: $rdf,
            form,
            value,
            focusNode,
            property,
            componentState: {},
            updateComponentState: sinon.spy(),
            renderer,
          }, actions)

          // then
          const fooPointer = property.shape.pointer.node(ex.Foo)
          expect(fooPointer.out(rdfs.label).term).to.deep.equal($rdf.literal('foo', 'de'))
          expect(fooPointer.out(schema.name).term).to.deep.equal($rdf.literal('bar', 'en'))
          expect(fooPointer.out(dcterms.title).term).to.deep.equal($rdf.literal('baz', 'fr'))
        })
      })

      it('only adds known labels to shapes graph', async () => {
        // given
        const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
        const property = testPropertyState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
        const value = testObjectState(focusNode.blankNode())
        value.object = focusNode.node(ex.Foo)
        const fetchedFoo = $rdf.clownface({ dataset: $rdf.dataset() })
          .node(ex.Foo)
          .addOut(hydra.title, $rdf.literal('ignored'))
        const editor = {
          ...instancesSelectEditor,
          loadInstance: sinon.stub().resolves(fetchedFoo),
        }

        // when
        await editor.init?.({
          env: $rdf,
          form,
          value,
          focusNode,
          property,
          componentState: {},
          updateComponentState: sinon.spy(),
          renderer,
        }, actions)

        // then
        const fooPointer = property.shape.pointer.node(ex.Foo)
        expect(fooPointer.out().terms).to.have.length(0)
      })

      it('does not attempt fetching blank nodes', async () => {
        // given
        const focusNode = $rdf.clownface().blankNode()
        const property = testPropertyState($rdf.clownface().blankNode())
        const value = testObjectState(focusNode.blankNode())
        value.object = focusNode.blankNode()
        const editor = {
          ...instancesSelectEditor,
          loadInstance: sinon.spy(),
        }

        // when
        await editor.init?.({
          env: $rdf,
          form,
          value,
          focusNode,
          property,
          componentState: {},
          updateComponentState: sinon.spy(),
          renderer,
        }, actions)

        // then
        expect(editor.loadInstance).not.to.have.been.called
      })
    })
  })
})
