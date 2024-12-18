import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { testFormState as testState, testFocusNodeState } from '@shaperone/testing/models/form.js'
import { popFocusNode } from '@hydrofoil/shaperone-core/models/forms/reducers/popFocusNode.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/forms/reducers/popFocusNode', () => {
  it('remove top node from stack', () => {
    // given
    const graph = $rdf.clownface()
    const focusNode1 = graph.node(ex.FocusNode1)
    const focusNode2 = graph.node(ex.FocusNode2)
    const state = testState({
      focusStack: [focusNode1, focusNode2],
      focusNodes: {
        [ex.FocusNode1.value]: testFocusNodeState(focusNode1),
        [ex.FocusNode2.value]: testFocusNodeState(focusNode2),
      },
    })

    // when
    const formState = popFocusNode(state)

    // then
    expect(formState.focusStack.length).to.eq(1)
    expect(formState.focusStack).to.include(focusNode1)
  })

  it('removes popped focus node state object', () => {
    // given
    const graph = $rdf.clownface()
    const focusNode = graph.node(ex.FocusNode)
    const state = testState({
      focusStack: [focusNode],
      focusNodes: {
        [ex.FocusNode.value]: testFocusNodeState(focusNode),
      },
    })

    // when
    const formState = popFocusNode(state)

    // then
    expect(formState.focusNodes).to.not.have.property(ex.FocusNode.value)
  })

  it('does nothing if stack is empty', () => {
    // given
    const state = testState()

    // when
    const next = popFocusNode(state)

    // then
    expect(next).to.equal(state)
  })
})
