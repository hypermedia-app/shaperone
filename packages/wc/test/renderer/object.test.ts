import { ObjectActions, ObjectRenderer } from '@hydrofoil/shaperone-core/renderer'
import { objectRenderer } from '@shaperone/testing/renderer'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { emptyGroupState, testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import { expect } from '@open-wc/testing'
import { blankNode } from '@shaperone/testing/nodeFactory'
import { sinon } from '@shaperone/testing'
import { renderObject } from '../../renderer/object'

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
    expect(renderer.context.templates.object).to.have.been.calledWith(sinon.match({
      actions: sinon.match({
        selectEditor: sinon.match.func,
        remove: sinon.match.func,
        removeObject: sinon.match.func,
      }),
    }), {
      object,
    })
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
