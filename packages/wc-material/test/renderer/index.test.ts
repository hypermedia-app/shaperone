import { expect, fixture, html } from '@open-wc/testing'
import * as sinon from 'sinon'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import ns from '@rdfjs/namespace'
import * as render from '../../renderer/index'
import { FocusNode } from '../../../core/index'

const ex = ns('http://example.com/')
type Params = Parameters<ReturnType<typeof render.focusNode>>[0]

describe('wc-material/renderer', () => {
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
})
