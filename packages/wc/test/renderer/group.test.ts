import { GroupRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms'
import { groupRenderer } from '@shaperone/testing/renderer.js'
import { emptyGroupState, testPropertyState } from '@shaperone/testing/models/form.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import { expect } from '@open-wc/testing'
import { sinon } from '@shaperone/testing'
import $rdf from '@shaperone/testing/env.js'
import { renderGroup } from '../../renderer/group.js'

describe('wc/renderer/group', () => {
  let renderer: GroupRenderer
  let group: PropertyGroupState

  beforeEach(() => {
    const focusNode = blankNode()
    group = emptyGroupState()
    renderer = groupRenderer({
      group,
      focusNode,
    })
  })

  it('renders properties of given group', () => {
    // given
    const groupShape = $rdf.rdfine.sh.PropertyGroup(blankNode())
    group.group = groupShape
    const withGroup = testPropertyState(blankNode(), {
      name: 'with-group',
      shape: {
        group: groupShape,
      },
    })
    renderer.focusNode.properties = [
      withGroup,
      testPropertyState(blankNode(), {
        name: 'no-group',
      }),
    ]

    // when
    renderGroup.call(renderer, { group })

    // then
    const groupSpy = renderer.context.templates.group as sinon.SinonStub
    expect(groupSpy.firstCall.args[1]).to.have.property('properties').deep.equals([withGroup])
  })

  it('renders properties without group if not selected', () => {
    // given
    const groupShape = $rdf.rdfine.sh.PropertyGroup(blankNode())
    const withGroup = testPropertyState(blankNode(), {
      name: 'with-group',
      shape: {
        group: groupShape,
      },
    })
    const noGroup = testPropertyState(blankNode(), {
      name: 'no-group',
    })
    renderer.focusNode.properties = [
      withGroup,
      noGroup,
    ]

    // when
    renderGroup.call(renderer, { group })

    // then
    const groupSpy = renderer.context.templates.group as sinon.SinonStub
    expect(groupSpy.firstCall.args[1]).to.have.property('properties').deep.equals([noGroup])
  })

  it('does not render hidden properties', () => {
    // given
    renderer.focusNode.properties = [
      testPropertyState(blankNode(), { hidden: true }),
      testPropertyState(blankNode(), { hidden: true }),
    ]

    // when
    renderGroup.call(renderer, { group })

    // then
    const groupSpy = renderer.context.templates.group as sinon.SinonStub
    expect(groupSpy.firstCall.args[1]).to.have.property('properties').with.length(0)
  })
})
