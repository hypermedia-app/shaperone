import { expect } from '@open-wc/testing'
import { ex, sinon } from '@shaperone/testing'
import { testObjectState, testPropertyState } from '@hydrofoil/shaperone-core/test/models/forms/util'
import clownface from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { Component } from '@hydrofoil/shaperone-core'
import { dash, rdfs, schema, dcterms, hydra } from '@tpluscode/rdf-ns-builders'
import { FormSettings } from '@hydrofoil/shaperone-core/models/forms'
import { instancesSelectEditor } from '../components'

describe('wc-vaadin/components', () => {
  describe('instancesSelectEditor', () => {
    describe('init', () => {
      const form: FormSettings = {
        labelProperties: [rdfs.label, schema.name, dcterms.title],
        languages: ['en'],
        shouldEnableEditorChoice: () => true,
      }
      const component: Component = {
        editor: dash.InstancesSelectEditor,
      }

      it('fetches named resource if it has no triples in data graph and sets its labels', async () => {
        // given
        const focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
        const property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
        const value = testObjectState(focusNode.blankNode())
        value.object = focusNode.node(ex.Foo)
        const fetchedFoo = clownface({ dataset: $rdf.dataset() })
          .node(ex.Foo)
          .addOut(rdfs.label, $rdf.literal('foo', 'de'))
          .addOut(schema.name, $rdf.literal('bar', 'en'))
          .addOut(dcterms.title, $rdf.literal('baz', 'fr'))
        const editor = {
          ...instancesSelectEditor,
          loadInstance: sinon.stub().resolves(fetchedFoo),
        }

        // when
        await editor.init?.({
          form,
          value,
          component,
          focusNode,
          property,
          updateComponentState: sinon.spy(),
        })

        // then
        const fooPointer = property.shape.pointer.node(ex.Foo)
        expect(fooPointer.out(rdfs.label).term).to.deep.equal($rdf.literal('foo', 'de'))
        expect(fooPointer.out(schema.name).term).to.deep.equal($rdf.literal('bar', 'en'))
        expect(fooPointer.out(dcterms.title).term).to.deep.equal($rdf.literal('baz', 'fr'))
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
          component,
          focusNode,
          property,
          updateComponentState: sinon.spy(),
        })

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
          component,
          focusNode,
          property,
          updateComponentState: sinon.spy(),
        })

        // then
        expect(editor.loadInstance).not.to.have.been.called
      })
    })
  })
})
