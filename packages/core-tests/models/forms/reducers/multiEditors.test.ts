import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { expect } from 'chai'
import { testEditor, testFocusNodeState, testPropertyState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { selectMultiEditor, selectSingleEditors } from '@hydrofoil/shaperone-core/models/forms/reducers/multiEditors.js'
import { propertyShape } from '@shaperone/testing/util.js'

describe('core/models/forms/reducers/multiEditors', () => {
  describe('selectMultiEditor', () => {
    it('selects first multi editor if no param given', () => {
      // given
      const focusNode = $rdf.clownface().blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [testPropertyState(shape.pointer, {
              editors: [testEditor(dash.MultiEditor1)],
            })],
          }),
        },
      })

      // when
      const after = selectMultiEditor(state, {
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor1)
    })

    it('selects desired multi editor', () => {
      // given
      const focusNode = $rdf.clownface().blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [testPropertyState(shape.pointer, {
              editors: [testEditor(dash.MultiEditor1), testEditor(dash.MultiEditor2)],
            })],
          }),
        },
      })

      // when
      const after = selectMultiEditor(state, {
        focusNode,
        property: shape,
        editor: dash.MultiEditor2,
      })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor2)
    })

    it('selects first multi editor if not found for id', () => {
      // given
      const focusNode = $rdf.clownface().blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [testPropertyState(shape.pointer, {
              editors: [testEditor(dash.MultiEditor1), testEditor(dash.MultiEditor2)],
            })],
          }),
        },
      })

      // when
      const after = selectMultiEditor(state, {
        focusNode,
        property: shape,
        editor: dash.MultiEditor3,
      })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor1)
    })

    it('resets component state', () => {
      // given
      const focusNode = $rdf.clownface().blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [testPropertyState(shape.pointer, {
              editors: [testEditor(dash.MultiEditor1)],
              componentState: { foo: 'bar' },
            })],
          }),
        },
      })

      // when
      const after = selectMultiEditor(state, {
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.componentState).to.deep.eq({})
    })
  })

  describe('selectSingleEditors', () => {
    it('selects first multi editor', () => {
      // given
      const focusNode = $rdf.clownface().blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [testPropertyState(shape.pointer, {
              selectedEditor: dash.MultiEditor1,
            })],
          }),
        },
      })

      // when
      const after = selectSingleEditors(state, {
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.be.undefined
    })
  })
})
