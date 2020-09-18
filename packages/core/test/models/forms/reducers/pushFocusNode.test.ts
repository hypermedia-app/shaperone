import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { pushFocusNode } from '../../../../models/forms/reducers/pushFocusNode'
import { testState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/pushFocusNode', () => {
  it('adds to focus node stack', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { form, state } = testState()
    state.instances.get(form)!.focusStack = [
      graph.node(ex.FocusNode1),
      graph.node(ex.FocusNode2),
    ]
    const property = new PropertyShapeMixin.Class(graph.namedNode(ex.propertyShape))

    // when
    const next = pushFocusNode(state, {
      form,
      focusNode: graph.node(ex.FocusNode3),
      property,
    })

    // then
    const instanceState = next.instances.get(form)!
    expect(instanceState.focusStack).to.have.property('length', 3)
  })

  it('initializes focus node state', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { form, state } = testState()
    const property = new PropertyShapeMixin.Class(graph.namedNode(ex.propertyShape))

    // when
    const next = pushFocusNode(state, {
      form,
      focusNode: graph.node(ex.FocusNode),
      property,
    })

    // then
    const instanceState = next.instances.get(form)!
    expect(instanceState.focusNodes).to.have.property(ex.FocusNode.value)
  })
})
