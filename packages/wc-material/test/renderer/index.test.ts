import { expect, fixture, html } from '@open-wc/testing'
import * as sinon from 'sinon'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import ns from '@rdf-esm/namespace'
import deepmerge from 'deepmerge'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'
import { RecursivePartial, testEditor, testPropertyState, testObjectState } from '@hydrofoil/shaperone-core/test/models/forms/util'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import * as render from '../../renderer/index'

const ex = ns('http://example.com/')

describe('wc-material/renderer', () => {
  type Params = Parameters<ReturnType<typeof render.focusNode>>[0]

  describe('focusNode', () => {
    const nullRenderer = () => html``
    const nullParams = (focusNode: FocusNode): Params => ({
      focusNode: {
        properties: [],
        focusNode,
        shapes: [],
        matchingShapes: [],
        groups: [],
        label: '',
      },
      actions: {
        popFocusNode: sinon.spy(),
        selectGroup: sinon.spy(),
        selectShape: sinon.spy(),
        truncateFocusNodes: sinon.spy(),
      },
      renderGroup: sinon.stub().callsFake(() => html``),
    })

    it('does not render shape selector when there is only one shape', async () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() })
        .node(ex.Foo)
        .addOut(rdfs.label, 'Foo')
        .term
      const params = nullParams(focusNode)

      // when
      const result = await fixture(render.focusNode(nullRenderer)(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })
  })

  describe('object', () => {
    type Params = Parameters<typeof render.object>[0]
    const nullParams: () => Params = () => {
      const shapesGraph = cf({ dataset: $rdf.dataset() })

      return ({
        object: {
          object: shapesGraph.blankNode().term,
          editors: [],
          selectedEditor: undefined,
        },
        property: {
          shape: new PropertyShapeMixin.Class(shapesGraph.blankNode()),
          editors: [],
          selectedEditor: undefined,
          objects: [],
          name: '',
          canAdd: false,
          canRemove: false,
        },
        renderEditor: sinon.spy(),
        actions: {
          remove: sinon.spy(),
          selectEditor: sinon.spy(),
        },
      })
    }

    it('renders a menu when there is more than one editor', async () => {
      // given
      const editor: SingleEditorMatch = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
        score: null,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor, editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode().term,
          selectedEditor: undefined,
        },
      })

      // when
      const result = await fixture(render.object(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })

    it('does not render a menu when there is more than one editor but switching is disabled', async () => {
      // given
      const editor: SingleEditorMatch = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
        score: null,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editorSwitchDisabled: true,
          editors: [editor, editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode().term,
          selectedEditor: undefined,
        },
      })

      // when
      const result = await fixture(render.object(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })

    it('renders a delete button when there is one editor', async () => {
      // given
      const editor: SingleEditorMatch = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
        score: 1,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode().term,
          selectedEditor: undefined,
        },
      })
      params.property.canRemove = true

      // when
      const result = await fixture(render.object(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })

    it('disables remove choice when property has multiple editors and minimum required values', async () => {
      // given
      const editor: SingleEditorMatch = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
        score: null,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor, editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode().term,
          selectedEditor: undefined,
        },
      })
      params.property.canRemove = false

      // when
      const result = await fixture(render.object(params))

      // then
      expect(result.querySelector('mwc-editor-toggle')).to.have.property('removeEnabled', false)
    })

    it('does not render remove button when property has minimum required values', async () => {
      // given
      const editor: SingleEditorMatch = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
        score: null,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode().term,
          selectedEditor: undefined,
        },
      })
      params.property.canRemove = false

      // when
      const result = await fixture(render.object(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })
  })

  describe('property', () => {
    type Params = Parameters<typeof render.property>[0]
    const nullParams: (init?: RecursivePartial<PropertyState>) => Params = (init?: RecursivePartial<PropertyState>) => {
      const pointer = cf({ dataset: $rdf.dataset() }).blankNode()

      return ({
        property: testPropertyState(pointer, init),
        renderObject: sinon.spy(),
        renderMultiEditor: sinon.spy(),
        actions: {
          addObject: sinon.spy(),
          selectMultiEditor: sinon.spy(),
          selectSingleEditors: sinon.spy(),
        },
      })
    }

    it('renders a selection menu when multi editor is available but not selected', async () => {
      // given
      const params = nullParams({
        editors: [testEditor(dash.TestEditor1)],
      })

      // when
      const result = await fixture(render.property(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })

    it('renders multi editor when it is selected', async () => {
      // given
      const params = nullParams({
        editors: [testEditor(dash.TestEditor1)],
        selectedEditor: dash.TestEditor1,
      })

      // when
      await fixture(render.property(params))

      // then
      expect(params.renderMultiEditor).to.have.been.called
    })

    it('does not render add row when caAdd=false', async () => {
      // given
      const params = nullParams({
        canAdd: false,
      })

      // when
      const result = await fixture(render.property(params))

      // then
      expect(result).dom.to.equalSnapshot()
    })

    it('renders every object', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const params = nullParams({
        objects: [
          testObjectState(graph.literal('foo')),
          testObjectState(graph.literal('bar')),
          testObjectState(graph.literal('baz')),
        ],
      })

      // when
      await fixture(render.property(params))

      // then
      expect(params.renderObject).to.have.been.calledThrice
    })
  })
})
