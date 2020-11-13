import { describe, it } from 'mocha'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { setObjectValue, setPropertyObjects } from '../../../../models/forms/reducers/updateObject'
import { RecursivePartial, testFocusNodeState, testObjectState, testState, testStore } from '../util'
import { propertyShape } from '../../../util'
import { Store } from '../../../../state'
import { FormState } from '../../../../models/forms'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/updateObject', () => {
  describe('setPropertyObjects', () => {
    it('removes all current triples and creates new', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
        .addOut(ex.prop, ['foo1', 'foo2'])
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
      })
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [{
                shape: property,
                objects: [],
                name: 'prop',
                canRemove: true,
                canAdd: true,
                editors: [],
                selectedEditor: undefined,
              }],
            }),
          },
        },
      })

      // when
      const after = setPropertyObjects(state, {
        focusNode,
        form,
        property,
        editors: testStore().store.getState().editors,
        objects: graph.node([$rdf.literal('bar1'), $rdf.literal('bar2'), $rdf.literal('bar3')]),
      })

      // then
      const { focusNodes: { [focusNode.value]: focusNodeState } } = after.get(form)!
      const values = focusNodeState.properties[0].objects.map(os => os.object?.value)
      expect(values).to.have.length(3)
      expect(values).to.include.members(['bar1', 'bar2', 'bar3'])
    })
  })

  describe('setObjectValue', () => {
    let store: Store
    let form: symbol
    let formState: {
      focusNodes: RecursivePartial<FormState['focusNodes']>
      focusStack: FormState['focusStack']
    }

    beforeEach(() => {
      ({ form, store } = testStore())
      formState = store.getState().forms.get(form)!
    })

    it('recalculates editors', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const object = testObjectState(graph.literal('foo'))
      const { editors } = store.getState()
      editors.matchSingleEditors = sinon.stub().returns([])
      const focusNode = graph.blankNode()
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [object],
          }],
        },
      }

      // when
      const value = graph.literal('bar')
      setObjectValue(store.getState().forms, {
        form,
        focusNode,
        editors,
        object,
        property,
        value,
      })

      // then
      expect(editors.matchSingleEditors).to.have.been.calledWith({
        shape: property,
        object: value,
      })
    })

    it('sets new value', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const object = testObjectState(graph.literal('foo'))
      const focusNode = graph.blankNode()
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [object],
          }],
        },
      }

      // when
      const value = graph.literal('bar')
      const afterState = setObjectValue(store.getState().forms, {
        form,
        focusNode,
        editors: store.getState().editors,
        object,
        property,
        value,
      })

      // then
      const objectAfter = afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects[0]
      expect(objectAfter?.object?.term).to.deep.eq($rdf.literal('bar'))
    })
  })
})
