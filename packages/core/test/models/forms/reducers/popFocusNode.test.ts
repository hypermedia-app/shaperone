import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdfjs/namespace'
import { popFocusNode } from '../../../../models/forms/reducers/popFocusNode'
import { testState, testFocusNodeState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/popFocusNode', () => {
  it('remove top node from stack', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const focusNode1 = graph.node(ex.FocusNode1)
    const focusNode2 = graph.node(ex.FocusNode2)
    const form = {}
    const state = testState(form, {
      form: {
        focusStack: [focusNode1, focusNode2],
        focusNodes: {
          [ex.FocusNode1.value]: testFocusNodeState(focusNode1),
          [ex.FocusNode2.value]: testFocusNodeState(focusNode2),
        },
      },
    })

    // when
    const next = popFocusNode(state, { form })

    // then
    const formState = next.instances.get(form)!
    expect(formState.focusStack.length).to.eq(1)
    expect(formState.focusStack).to.include(focusNode1)
  })

  it('removes popped focus node state object', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const focusNode = graph.node(ex.FocusNode)
    const form = {}
    const state = testState(form, {
      form: {
        focusStack: [focusNode],
        focusNodes: {
          [ex.FocusNode.value]: testFocusNodeState(focusNode),
        },
      },
    })

    // when
    const next = popFocusNode(state, { form })

    // then
    const formState = next.instances.get(form)!
    expect(formState.focusNodes).to.not.have.property(ex.FocusNode.value)
  })

  it('does nothing if stack is empty', () => {
    // given
    const form = {}
    const state = testState(form)

    // when
    const next = popFocusNode(state, { form })

    // then
    expect(next).to.equal(state)
  })
})
