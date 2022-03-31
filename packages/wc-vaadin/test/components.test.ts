import { expect } from '@open-wc/testing'
import { ex, sinon } from '@shaperone/testing'
import { testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import clownface, { GraphPointer } from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { rdfs, schema, dcterms, hydra } from '@tpluscode/rdf-ns-builders'
import { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { BlankNode } from 'rdf-js'
import { SingleEditorActions, UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import promise from 'promise-the-world'
import { ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { objectRenderer } from '@shaperone/testing/renderer'
import type { SinonStubbedInstance } from 'sinon'
import { instancesSelectEditor } from '../components'

describe('wc-vaadin/components', () => {
  describe('instancesSelectEditor', () => {
    describe('init', () => {
      const form: FormSettings = {
        labelProperties: [rdfs.label, schema.name, dcterms.title],
        languages: ['en'],
        shouldEnableEditorChoice: () => true,
      }

      let renderer: ObjectRenderer
      let focusNode: GraphPointer<BlankNode>
      let fetchedInstance: GraphPointer
      let property: PropertyState
      let value: PropertyObjectState
      let updateComponentState: UpdateComponentState
      let actions: SinonStubbedInstance<SingleEditorActions>

      beforeEach(() => {
        focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
        property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
        fetchedInstance = clownface({ dataset: $rdf.dataset() }).node(ex.Foo)
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
            form,
            value,
            focusNode,
            property,
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
          value.componentState.ready = true

          // when
          const result = editor.init?.({
            form,
            value,
            focusNode,
            property,
            updateComponentState,
            renderer,
          }, actions)

          // then
          expect(result).to.be.true
          expect(editor.loadInstance).not.to.have.been.called
        })

        it('sets ready flag if loading instance fails', async () => {
          // given
          const deferred = promise.defer()
          const editor = {
            ...instancesSelectEditor,
            loadInstance: sinon.stub().callsFake(() => {
              deferred.resolve('')
              throw new Error()
            }),
          }

          // when
          editor.init?.({
            form,
            value,
            focusNode,
            property,
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
            form,
            value,
            focusNode,
            property,
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
        const focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
        const property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
        const value = testObjectState(focusNode.blankNode())
        value.object = focusNode.node(ex.Foo)
        const fetchedFoo = clownface({ dataset: $rdf.dataset() })
          .node(ex.Foo)
          .addOut(hydra.title, $rdf.literal('ignored'))
        const editor = {
          ...instancesSelectEditor,
          loadInstance: sinon.stub().resolves(fetchedFoo),
        }

        // when
        await editor.init?.({
          form,
          value,
          focusNode,
          property,
          updateComponentState: sinon.spy(),
          renderer,
        }, actions)

        // then
        const fooPointer = property.shape.pointer.node(ex.Foo)
        expect(fooPointer.out().terms).to.have.length(0)
      })

      it('does not attempt fetching blank nodes', async () => {
        // given
        const focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
        const property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
        const value = testObjectState(focusNode.blankNode())
        value.object = focusNode.blankNode()
        const editor = {
          ...instancesSelectEditor,
          loadInstance: sinon.spy(),
        }

        // when
        await editor.init?.({
          form,
          value,
          focusNode,
          property,
          updateComponentState: sinon.spy(),
          renderer,
        }, actions)

        // then
        expect(editor.loadInstance).not.to.have.been.called
      })
    })
  })
})
