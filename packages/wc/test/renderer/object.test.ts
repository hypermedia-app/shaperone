import type { ObjectActions, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer.js'
import { objectRenderer } from '@shaperone/testing/renderer.js'
import type { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { emptyGroupState, testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import { expect } from '@open-wc/testing'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import type { sinon } from '@shaperone/testing'
import { renderObject } from '../../renderer/object.js'

describe('wc/renderer/object', () => {
  let renderer: ObjectRenderer
  let object: PropertyObjectState

  beforeEach(() => {
    object = testObjectState()
    const focusNode = blankNode()
    const group = emptyGroupState()
    const property = testPropertyState()

    renderer = objectRenderer({
      object,
      property,
      focusNode,
      group,
    })
  })

  it('calls object template', () => {
    // when
    renderObject.call(renderer, { object })

    // then
    const render = renderer.context.templates.object as sinon.SinonSpy
    expect(render.firstCall.firstArg).to.have.property('actions')
    expect(render.firstCall.args[1]).to.have.property('object', object)
  })

  describe('actions', () => {
    let actions: ObjectActions

    beforeEach(() => {
      const render = renderer.context.templates.object as sinon.SinonSpy

      renderObject.call(renderer, { object })

      actions = render.firstCall.firstArg.actions
    })

    describe('remove', () => {
      it('calls property action with self as parameter', () => {
        // when
        actions.remove()

        // then
        expect(renderer.actions.removeObject).to.have.been.calledWith(object)
      })
    })
  })
})
