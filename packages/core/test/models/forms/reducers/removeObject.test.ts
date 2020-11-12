import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { removeObject } from '../../../../models/forms/reducers/removeObject'
import { RecursivePartial, testStore } from '../util'
import { Store } from '../../../../state'
import { FocusNode } from '../../../../index'
import { propertyShape } from '../../../util'
import { FormState } from '../../../../models/forms'

describe('models/forms/reducers/removeObject', () => {
  let store: Store
  let form: symbol
  let focusNode: FocusNode
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
  }

  beforeEach(() => {
    ({ form, store } = testStore())
    focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
    formState = store.getState().forms.get(form)!
  })

  it('removes state objects with matching value', () => {
    // given
    const property = propertyShape()
    const object = focusNode.literal('1')
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        objects: [{
          object: focusNode.literal('1'),
        }, {
          object: focusNode.literal('1'),
        }, {
          object: focusNode.literal('2'),
        }],
      }],
    }

    // when
    const afterState = removeObject(store.getState().forms, {
      form,
      focusNode,
      object,
      property,
    })

    // then
    const afterProperty = afterState.get(form)?.focusNodes[focusNode.value].properties[0]
    expect(afterProperty?.objects).to.have.length(1)
    expect(afterProperty?.objects[0].object?.term).to.deep.eq($rdf.literal('2'))
  })

  it('does not remove state objects without values', () => {
    // given
    const property = propertyShape()
    const object = focusNode.literal('1')
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        objects: [{
        }, {
        }, {
        }],
      }],
    }

    // when
    const afterState = removeObject(store.getState().forms, {
      form,
      focusNode,
      object,
      property,
    })

    // then
    const afterProperty = afterState.get(form)?.focusNodes[focusNode.value].properties[0]
    expect(afterProperty?.objects).to.have.length(3)
  })

  it('updates canRemove flag', () => {
    // given
    const property = propertyShape({
      maxCount: 2,
    })
    const object = focusNode.literal('1')
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        canRemove: false,
        objects: [{
          object: focusNode.node(object),
        }, {}],
      }],
    }

    // when
    const afterState = removeObject(store.getState().forms, {
      form,
      focusNode,
      object,
      property,
    })

    // then
    const afterProperty = afterState.get(form)?.focusNodes[focusNode.value].properties[0]
    expect(afterProperty?.canRemove).to.eq(true)
  })

  it('updates canAdd flag', () => {
    // given
    const property = propertyShape({
      maxCount: 2,
    })
    const object = focusNode.literal('1')
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        canAdd: false,
        objects: [{
          object: focusNode.node(object),
        }, {}],
      }],
    }

    // when
    const afterState = removeObject(store.getState().forms, {
      form,
      focusNode,
      object,
      property,
    })

    // then
    const afterProperty = afterState.get(form)?.focusNodes[focusNode.value].properties[0]
    expect(afterProperty?.canAdd).to.eq(true)
  })
})
