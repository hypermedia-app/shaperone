import { describe, it } from 'mocha'
import { expect } from 'chai'
import ns from '@rdfjs/namespace'
import cf from 'clownface'
import { PropertyGroupMixin } from '@rdfine/shacl'
import $rdf from 'rdf-ext'
import { selectGroup } from '../../../../models/forms/reducers/selectGroup'
import { testFocusNodeState, testState } from '../util'

const ex = ns('http://example.com/')

describe('models/forms/reducers/selectGroup', () => {
  it('sets flag on selected group and unsets others', () => {
    // given
    const form = {}
    const graph = cf({ dataset: $rdf.dataset() })
    const focusNode = graph.node(ex.FocusNode)
    const state = testState(form, {
      form: {
        focusNodes: {
          [ex.FocusNode.value]: testFocusNodeState(focusNode, {
            groups: [{
              selected: true,
              group: new PropertyGroupMixin.Class(graph.node(ex.Group0)),
              order: 0,
            }, {
              selected: true,
              group: new PropertyGroupMixin.Class(graph.node(ex.Group1)),
              order: 1,
            }],
          }),
        },
      },
    })

    // when
    const next = selectGroup(state, { form, focusNode, group: new PropertyGroupMixin.Class(graph.node(ex.Group1)) })

    // then
    const focusNodeState = next.instances.get(form)!.focusNodes[ex.FocusNode.value]
    expect(focusNodeState.groups[0].selected).to.be.false
    expect(focusNodeState.groups[1].selected).to.be.true
  })
})
