import { expect, fixture, html } from '@open-wc/testing'
import $rdf from '@zazuko/env/web.js'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import type { SingleEditorMatch } from '@hydrofoil/shaperone-core/models/editors'
import { testPropertyState, testObjectState, emptyGroupState, testFocusNode } from '@shaperone/testing/models/form.js'
import type { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { List } from '@material/mwc-list/mwc-list.js'
import { focusNodeRenderer, objectRenderer, propertyRenderer } from '@shaperone/testing/renderer.js'
import type { ObjectRenderer, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import * as render from '../../renderer/index.js'

const ex = $rdf.namespace('http://example.com/')

describe('wc-material/renderer', () => {
  describe('focusNode', () => {
    const nullRenderer = () => html``

    before(async () => {
      await Promise.all(render.focusNode(nullRenderer).loadDependencies?.() || [])
    })

    it('does not render shape selector when there is only one shape', async () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() })
        .node(ex.Foo)
        .addOut(rdfs.label, 'Foo')
      const renderer = focusNodeRenderer({ focusNode })

      // when
      const result = await fixture<List>(render.focusNode(nullRenderer)(renderer, {
        focusNode: testFocusNode(focusNode),
      }))

      // then
      expect(result.items[0].hasMeta).to.be.false
    })
  })

  describe('object', () => {
    let renderer: ObjectRenderer
    let object: PropertyObjectState

    beforeEach(() => {
      const property = testPropertyState(blankNode())
      const focusNode = testFocusNode(blankNode())
      object = {
        key: 'foo',
        editors: [],
        object: blankNode(),
        selectedEditor: undefined,
        componentState: {},
        validationResults: [],
        hasErrors: false,
        nodeKind: undefined,
        overrides: undefined,
      }
      renderer = objectRenderer({
        property,
        focusNode,
        group: emptyGroupState(),
        object,
      })
    })

    it('renders a menu when there is more than one editor', async () => {
      // given
      const editor: SingleEditorMatch = {
        term: dash.TextAreaEditor,
        meta: blankNode(),
        score: null,
      }
      object.editors = [editor, editor]

      // when
      const result = await fixture(render.object(renderer, {
        object,
      }))

      // then
      expect(result.querySelector('mwc-editor-toggle')).not.to.be.null
    })

    it('does not render a menu when there is more than one editor but switching is disabled', async () => {
      // given
      const editor: SingleEditorMatch = {
        term: dash.TextAreaEditor,
        meta: blankNode(),
        score: null,
      }
      object.editorSwitchDisabled = true
      object.editors = [editor, editor]

      // when
      const result = await fixture(render.object(renderer, {
        object,
      }))

      // then
      expect(result.querySelector('mwc-editor-toggle')).to.be.null
    })

    it('renders a delete button when there is one editor', async () => {
      // given
      const editor: SingleEditorMatch = {
        term: dash.TextAreaEditor,
        meta: blankNode(),
        score: 1,
      }
      object.editors = [editor]
      renderer.property.canRemove = true

      // when
      const result = await fixture(render.object(renderer, { object }))

      // then
      expect(result.querySelector('mwc-icon[title="Remove value"]')).not.to.be.null
    })

    it('disables remove choice when property has multiple editors and minimum required values', async () => {
      // given
      const editor: SingleEditorMatch = {
        term: dash.TextAreaEditor,
        meta: blankNode(),
        score: null,
      }
      object.editors = [editor, editor]
      renderer.property.canRemove = false

      // when
      const result = await fixture(render.object(renderer, { object }))

      // then
      expect(result.querySelector('mwc-editor-toggle')).to.have.property('removeEnabled', false)
    })

    it('does not render remove button when property has minimum required values', async () => {
      // given
      const editor: SingleEditorMatch = {
        term: dash.TextAreaEditor,
        meta: blankNode(),
        score: null,
      }
      object.editors = [editor]
      renderer.property.canRemove = false

      // when
      const result = await fixture(render.object(renderer, { object }))

      // then
      expect(result.querySelector('mwc-icon[title="Remove value"]')).to.be.null
    })
  })

  describe('property', () => {
    let renderer: PropertyRenderer
    let property: PropertyState

    beforeEach(() => {
      property = testPropertyState(blankNode())
      const focusNode = testFocusNode(blankNode())
      renderer = propertyRenderer({
        focusNode,
        property,
      })
    })

    it('renders a selection menu when multi editor is available but not selected', async () => {
      // given
      property.editors = [{
        term: dash.TestEditor1,
        score: null,
      }]

      // when
      const result = await fixture(render.property(renderer, { property }))

      // then
      expect(result.querySelector('mwc-property-menu')).not.to.be.null
    })

    it('renders multi editor when it is selected', async () => {
      // given
      property.editors = [{
        term: dash.TestEditor1,
        score: null,
      }]
      property.selectedEditor = dash.TestEditor1

      // when
      await fixture(render.property(renderer, { property }))

      // then
      expect(renderer.renderMultiEditor).to.have.been.called
    })

    it('does not render add row when canAdd=false', async () => {
      // given
      property.canAdd = false

      // when
      const result = await fixture(render.property(renderer, { property }))

      // then
      expect(result.querySelector('mwc-icon')).to.be.null
    })

    it('renders every object', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      property.objects = [
        testObjectState(graph.literal('foo')),
        testObjectState(graph.literal('bar')),
        testObjectState(graph.literal('baz')),
      ]

      // when
      await fixture(render.property(renderer, { property }))

      // then
      expect(renderer.renderObject).to.have.been.calledThrice
    })
  })
})
