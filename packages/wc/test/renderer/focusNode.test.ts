import { testFocusNode, testPropertyState, testObjectState } from '@shaperone/testing/models/form'
import { sinon } from '@shaperone/testing'
import { FormRenderer } from '@hydrofoil/shaperone-core/renderer'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { fixture, html, expect } from '@open-wc/testing'
import { Dispatch } from '@hydrofoil/shaperone-core/state'
import { any, blankNode } from '@shaperone/testing/nodeFactory.js'
import { formRenderer } from '@shaperone/testing/renderer'
import { renderFocusNode } from '../../renderer/focusNode.js'

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
    renderer.context.state.focusNodes[focusNode.value] = testFocusNode(any().node(focusNode.term))

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

  describe('actions', () => {
    describe('clearProperty', () => {
      it('calls remove for every object', async () => {
        // given
        const childState = testFocusNode(focusNode.blankNode())
        const property = testPropertyState(blankNode(), {
          objects: [testObjectState(), testObjectState(), testObjectState()],
        })
        childState.properties = [property]
        renderer.context.state.focusNodes[focusNode.value] = childState
        renderer.context.templates.focusNode = sinon.stub().callsFake(({ actions }) => html`<button @click="${() => {
          actions.clearProperty(property.shape)
        }}"></button>`)

        // when
        const result = await fixture<HTMLElement>(renderFocusNode.call(renderer, { focusNode }))
        result.click()

        // then
        expect(dispatch.removeObject).to.have.been.called.callCount(3)
      })

      it('calls clearValue when property disallows removing object', async () => {
        // given
        const childState = testFocusNode(focusNode.blankNode())
        const property = testPropertyState(blankNode(), {
          objects: [testObjectState(), testObjectState(), testObjectState()],
          canRemove: false,
        })
        childState.properties = [property]
        renderer.context.state.focusNodes[focusNode.value] = childState
        renderer.context.templates.focusNode = sinon.stub().callsFake(({ actions }) => html`<button @click="${() => {
          actions.clearProperty(property.shape)
        }}"></button>`)

        // when
        const result = await fixture<HTMLElement>(renderFocusNode.call(renderer, { focusNode }))
        result.click()

        // then
        expect(dispatch.clearValue).to.have.been.called.callCount(3)
      })

      it('does nothing when property is not found', async () => {
        // given
        const childState = testFocusNode(focusNode.blankNode())
        const property = testPropertyState(blankNode(), {
          objects: [testObjectState(), testObjectState(), testObjectState()],
        })
        childState.properties = [property]
        renderer.context.state.focusNodes[focusNode.value] = childState
        renderer.context.templates.focusNode = sinon.stub().callsFake(({ actions }) => html`<button @click="${() => {
          actions.clearProperty(testPropertyState().shape)
        }}"></button>`)

        // when
        const result = await fixture<HTMLElement>(renderFocusNode.call(renderer, { focusNode }))
        result.click()

        // then
        expect(dispatch.clearValue).not.to.have.been.called
        expect(dispatch.removeObject).not.to.have.been.called
      })
    })
  })
})
