import { GroupRenderer } from '@hydrofoil/shaperone-core/renderer'
import { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms'
import { groupRenderer } from '@shaperone/testing/renderer'
import { emptyGroupState, testPropertyState } from '@shaperone/testing/models/form'
import { blankNode } from '@shaperone/testing/nodeFactory'
import { expect } from '@open-wc/testing'
import { sinon } from '@shaperone/testing'
import { fromPointer } from '@rdfine/shacl/lib/PropertyGroup'
import { renderGroup } from '../../renderer/group'

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
    const groupShape = fromPointer(blankNode())
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
    expect(renderer.context.templates.group).to.have.been.calledWith(sinon.match.object, {
      properties: sinon.match.array.deepEquals([withGroup]),
    })
  })

  it('renders properties without group if not selected', () => {
    // given
    const groupShape = fromPointer(blankNode())
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
    expect(renderer.context.templates.group).to.have.been.calledWith(sinon.match.object, {
      properties: sinon.match.array.deepEquals([noGroup]),
    })
  })
})
