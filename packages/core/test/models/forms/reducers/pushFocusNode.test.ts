import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdfjs/namespace'
import { pushFocusNode } from '../../../../models/forms/reducers/pushFocusNode'
import { testState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/pushFocusNode', () => {
  it('adds to focus node stack', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const form = {}
    const state = testState(form)
    state.instances.get(form)!.focusStack = [
      graph.node(ex.FocusNode1),
      graph.node(ex.FocusNode2),
    ]

    // when
    const next = pushFocusNode(state, {
      form,
      focusNode: graph.node(ex.FocusNode3),
    })

    // then
    const instanceState = next.instances.get(form)!
    expect(instanceState.focusStack).to.have.property('length', 3)
  })

  it('initializes focus node state', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const form = {}
    const state = testState(form)

    // when
    const next = pushFocusNode(state, {
      form,
      focusNode: graph.node(ex.FocusNode),
    })

    // then
    const instanceState = next.instances.get(form)!
    expect(instanceState.focusNodes).to.have.property(ex.FocusNode.value)
  })
})
