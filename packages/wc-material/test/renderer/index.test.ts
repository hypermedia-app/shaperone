import { expect, fixture, html } from '@open-wc/testing'
import * as sinon from 'sinon'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import ns from '@rdfjs/namespace'
import deepmerge from 'deepmerge'
import { PropertyShapeMixin } from '@rdfine/shacl'
import * as render from '../../renderer/index'
import { FocusNode } from '../../../core/index'
import { SingleEditor } from '../../../core/models/editors/index'

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
        groups: [],
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
          object: shapesGraph.blankNode(),
          editors: [],
          selectedEditor: undefined,
        },
        property: {
          shape: new PropertyShapeMixin.Class(shapesGraph.blankNode()),
          multiEditor: undefined,
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
      const editor: SingleEditor = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor, editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode(),
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
      const editor: SingleEditor = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode(),
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
      const editor: SingleEditor = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor, editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode(),
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
      const editor: SingleEditor = {
        match: sinon.spy(),
        term: dash.TextAreaEditor,
      }
      const params = deepmerge<Params>(nullParams(), {
        object: {
          editors: [editor],
          object: cf({ dataset: $rdf.dataset() }).blankNode(),
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
})
