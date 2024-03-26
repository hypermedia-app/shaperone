import { PropertyActions, PropertyRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { propertyRenderer } from '@shaperone/testing/renderer.js'
import { blankNode, namedNode } from '@shaperone/testing/nodeFactory.js'
import { emptyGroupState, testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { expect } from '@open-wc/testing'
import { ex, sinon } from '@shaperone/testing'
import { Dispatch } from '@hydrofoil/shaperone-core/state'
import { renderProperty } from '../../renderer/property.js'

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
    const render = renderer.context.templates.property as sinon.SinonSpy
    expect(render.firstCall.args[1]).to.have.property('property', property)
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
        expect(dispatch.removeObject.firstCall.firstArg).to.have.property('object', fooObject)
      })

      it('dispatches action when called with pointer', () => {
        // given
        const object = namedNode(ex.foo)

        // when
        actions.removeObject(object)

        // then
        expect(dispatch.removeObject.firstCall.firstArg).to.have.property('object', fooObject)
      })

      it('dispatches action when called with state object', () => {
        // when
        actions.removeObject(fooObject)

        // then
        expect(dispatch.removeObject.firstCall.firstArg).to.have.property('object', fooObject)
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

    describe('addObject', () => {
      it('called with pointer overrides, forwards them to dispatch', () => {
        // given
        const overrides = blankNode()

        // when
        actions.addObject({ overrides })

        // then
        expect(dispatch.addObject.firstCall.args[0].overrides).to.eq(overrides)
      })

      it('called with componentState, forwards it to dispatch', () => {
        // given
        const componentState = {}

        // when
        actions.addObject({ componentState })

        // then
        expect(dispatch.addObject.firstCall.firstArg).to.have.property('componentState', componentState)
      })
    })
  })
})
