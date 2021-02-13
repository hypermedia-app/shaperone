import { PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer'
import { propertyRenderer } from '@shaperone/testing/renderer'
import { blankNode, namedNode } from '@shaperone/testing/nodeFactory'
import { emptyGroupState, testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { expect } from '@open-wc/testing'
import { ex, sinon } from '@shaperone/testing'
import { Dispatch } from '@hydrofoil/shaperone-core/state'
import { renderProperty } from '../../renderer/property'

describe('wc/renderer/property', () => {
  let renderer: PropertyRenderer
  let property: PropertyState
  let fooObject: PropertyObjectState

  beforeEach(() => {
    const focusNode = blankNode()
    const group = emptyGroupState()
    property = testPropertyState()

    fooObject = testObjectState(focusNode.node(ex.foo))
    property.objects.push(fooObject)
    property.objects.push(testObjectState(focusNode.node(ex.bar)))

    renderer = propertyRenderer({
      focusNode,
      property,
      group,
    })
  })

  it('calls property template', async () => {
    // when
    renderProperty.call(renderer, { property })

    // then
    expect(renderer.context.templates.property).to.have.been.calledWith(sinon.match.object, {
      property,
    })
  })

  describe('actions', () => {
    let actions: PropertyActions
    let dispatch: sinon.SinonStubbedInstance<Dispatch['forms']>

    beforeEach(() => {
      const render = renderer.context.templates.property as sinon.SinonSpy

      renderProperty.call(renderer, { property })

      actions = render.firstCall.firstArg.actions
      dispatch = renderer.context.dispatch.forms as any
    })

    describe('removeObject', () => {
      it('dispatches action when called with term', () => {
        // given
        const object = ex.foo

        // when
        actions.removeObject(object)

        // then
        expect(dispatch.removeObject).to.have.been.calledWith(sinon.match({
          object: fooObject,
        }))
      })

      it('dispatches action when called with pointer', () => {
        // given
        const object = namedNode(ex.foo)

        // when
        actions.removeObject(object)

        // then
        expect(dispatch.removeObject).to.have.been.calledWith(sinon.match({
          object: fooObject,
        }))
      })

      it('dispatches action when called with state object', () => {
        // when
        actions.removeObject(fooObject)

        // then
        expect(dispatch.removeObject).to.have.been.calledWith(sinon.match({
          object: fooObject,
        }))
      })

      it('does not dispatch action when object is not found', () => {
        // given
        const object = namedNode(ex.baz)

        // when
        actions.removeObject(object)

        // then
        expect(dispatch.removeObject).not.to.have.been.called
      })
    })
  })
})
