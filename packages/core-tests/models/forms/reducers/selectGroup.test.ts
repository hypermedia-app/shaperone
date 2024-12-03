import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { testFocusNodeState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { selectGroup } from '@hydrofoil/shaperone-core/models/forms/reducers/selectGroup.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/forms/reducers/selectGroup', () => {
  it('sets flag on selected group and unsets others', () => {
    // given
    const graph = $rdf.clownface()
    const focusNode = graph.node(ex.FocusNode)
    const state = testState({
      focusNodes: {
        ...testFocusNodeState(focusNode, {
          groups: [{
            selected: true,
            group: $rdf.rdfine.sh.PropertyGroup(graph.node(ex.Group0)),
            order: 0,
          }, {
            selected: true,
            group: $rdf.rdfine.sh.PropertyGroup(graph.node(ex.Group1)),
            order: 1,
          }],
        }),
      },
    })

    // when
    const next = selectGroup(state, { focusNode, group: $rdf.rdfine.sh.PropertyGroup(graph.node(ex.Group1)) })

    // then
    const focusNodeState = next.focusNodes[ex.FocusNode.value]
    expect(focusNodeState.groups[0].selected).to.be.false
    expect(focusNodeState.groups[1].selected).to.be.true
  })
})
