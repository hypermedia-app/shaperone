import { testFocusNode } from '@shaperone/testing/models/form'
import { sinon } from '@shaperone/testing'
import { FormRenderer } from '@hydrofoil/shaperone-core/renderer'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { fixture, html, expect } from '@open-wc/testing'
import { Dispatch } from '@hydrofoil/shaperone-core/state'
import { any } from '@shaperone/testing/nodeFactory'
import { formRenderer } from '@shaperone/testing/renderer'
import { renderFocusNode } from '../../renderer/focusNode'

describe('wc/renderer/focusNode', () => {
  let focusNode: FocusNode
  let renderer: sinon.SinonStubbedInstance<FormRenderer>
  let dispatch: sinon.SinonStubbedInstance<Dispatch['forms']>

  beforeEach(() => {
    focusNode = testFocusNode().focusNode
    renderer = formRenderer()
    dispatch = renderer.context.dispatch.forms as any
  })

  it('dispatches to create node when there is none', async () => {
    // given
    renderer.context.templates.initialising = () => html`Loading`

    // when
    const result = await fixture(html`<div>${renderFocusNode.call(renderer, { focusNode })}</div>`)

    // then
    expect(result.textContent).to.eq('Loading')
    expect(dispatch.createFocusNodeState).to.have.been.calledWith(sinon.match({
      focusNode: sinon.match({
        term: focusNode.term,
      }),
    }))
  })

  it('dispatches to create node when previous node was from different dataset', async () => {
    // given
    renderer.context.templates.initialising = () => html`Loading`
    renderer.context.state.focusNodes[focusNode.value] = testFocusNode(any().node(focusNode))

    // when
    await fixture(html`<div>${renderFocusNode.call(renderer, { focusNode })}</div>`)

    // then
    expect(dispatch.createFocusNodeState).to.have.been.calledWith(sinon.match({
      focusNode: sinon.match({
        term: focusNode.term,
      }),
    }))
  })

  it('calls render template', async () => {
    // given
    const childState = testFocusNode(focusNode.blankNode())
    renderer.context.state.focusNodes[focusNode.value] = childState
    renderer.context.templates.focusNode = sinon.stub().returns(html`Focus node`)

    // when
    const result = await fixture(html`<div>${renderFocusNode.call(renderer, { focusNode })}</div>`)

    // then
    expect(result.textContent).to.eq('Focus node')
    expect(renderer.context.templates.focusNode).to.have.been.calledWith(sinon.match({
      focusNode: childState,
    }))
  })
})
