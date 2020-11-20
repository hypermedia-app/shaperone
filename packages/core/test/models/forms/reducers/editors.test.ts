import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { toggleSwitching, updateComponentState } from '../../../../models/forms/reducers/editors'
import { testFocusNodeState, testObjectState, testPropertyState, testState } from '../util'
import { PropertyObjectState } from '../../../../models/forms'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      containAll<T = unknown>(cb: (item: T) => boolean): void
      containOne<T = unknown>(cb: (item: T) => boolean): void
      containExactlyOne<T = unknown>(cb: (item: T) => boolean): void
    }
  }
}

describe('core/models/forms/reducers/editors', () => {
  describe('toggleSwitching', () => {
    it('can disable all editor switches', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                objects: [
                  testObjectState(focusNode.literal('foo'), { editorSwitchDisabled: undefined }),
                  testObjectState(focusNode.literal('foo'), { editorSwitchDisabled: true }),
                ],
              })],
            }),
          },
        },
      })

      // when
      const after = toggleSwitching(state, { form, switchingEnabled: false })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.objects).to.containAll<PropertyObjectState>(o => o.editorSwitchDisabled === true)
    })

    it('can enable all editor switches', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                objects: [
                  testObjectState(focusNode.literal('foo'), { editorSwitchDisabled: undefined }),
                  testObjectState(focusNode.literal('foo'), { editorSwitchDisabled: true }),
                ],
              })],
            }),
          },
        },
      })

      // when
      const after = toggleSwitching(state, { form, switchingEnabled: true })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.objects).to.containAll<PropertyObjectState>(o => o.editorSwitchDisabled === false)
    })
  })

  describe('updateComponentState', () => {
    it('merges current and new state for multi editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        componentState: {
          foo: 'bar',
        },
      })
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
        },
      })

      // when
      const after = updateComponentState(state, {
        form,
        focusNode,
        property: property.shape,
        newState: {
          bar: { bar: 'baz' },
        },
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.componentState).to.deep.equal({
        foo: 'bar',
        bar: { bar: 'baz' },
      })
    })

    it('merges current and new state for single editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const object = testObjectState(focusNode.literal('foo'), {
        componentState: {
          foo: 'bar',
        },
      })
      const property = testPropertyState(shape.pointer, {
        objects: [object],
      })
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
        },
      })

      // when
      const after = updateComponentState(state, {
        form,
        focusNode,
        property: property.shape,
        object,
        newState: {
          bar: { bar: 'baz' },
        },
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.objects[0].componentState).to.deep.equal({
        foo: 'bar',
        bar: { bar: 'baz' },
      })
    })
  })
})
