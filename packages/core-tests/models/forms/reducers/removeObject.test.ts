import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { RecursivePartial } from '@shaperone/testing'
import { testObjectState, testStore } from '@shaperone/testing/models/form'
import { removeObject } from '@hydrofoil/shaperone-core/models/forms/reducers/removeObject'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { propertyShape } from '@shaperone/testing/util'

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

  it('removes state objects with matching key', () => {
    // given
    const property = propertyShape()
    const object = testObjectState(focusNode.literal('1'), {
      key: 'remove',
    })
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        objects: [{
          key: 'remove',
        }, {
          key: 'remove',
        }, {
          key: 'foo',
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
    expect(afterProperty?.objects[0].key).to.eq('foo')
  })

  it('updates canRemove flag', () => {
    // given
    const property = propertyShape({
      maxCount: 2,
    })
    const object = testObjectState(focusNode.literal('1'), {
      key: 'remove',
    })
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        canRemove: false,
        objects: [{
          key: 'remove',
        }, {
          key: 'stay',
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
    expect(afterProperty?.canRemove).to.eq(true)
  })

  it('updates canAdd flag', () => {
    // given
    const property = propertyShape({
      maxCount: 2,
    })
    const object = testObjectState(focusNode.literal('1'), {
      key: 'remove',
    })
    formState.focusNodes[focusNode.value] = {
      properties: [{
        shape: property,
        canAdd: false,
        objects: [{
          key: 'remove',
        }, {
          key: 'stay',
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
    expect(afterProperty?.canAdd).to.eq(true)
  })
})
