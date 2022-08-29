import { describe, it } from 'mocha'
import { expect } from 'chai'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import { fromPointer } from '@rdfine/shacl/lib/PropertyGroup'
import $rdf from 'rdf-ext'
import { testFocusNodeState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { selectGroup } from '@hydrofoil/shaperone-core/models/forms/reducers/selectGroup.js'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/selectGroup', () => {
  it('sets flag on selected group and unsets others', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state } = testState(undefined, {
      form: {
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            groups: [{
              selected: true,
              group: fromPointer(graph.node(ex.Group0)),
              order: 0,
            }, {
              selected: true,
              group: fromPointer(graph.node(ex.Group1)),
              order: 1,
            }],
          }),
        },
      },
    })

    // when
    const next = selectGroup(state, { form, focusNode, group: fromPointer(graph.node(ex.Group1)) })

    // then
    const focusNodeState = next.get(form)!.focusNodes[ex.FocusNode.value]
    expect(focusNodeState.groups[0].selected).to.be.false
    expect(focusNodeState.groups[1].selected).to.be.true
  })
})
