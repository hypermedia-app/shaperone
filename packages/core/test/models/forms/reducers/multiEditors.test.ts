import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { dash } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { selectMultiEditor, selectSingleEditors } from '../../../../models/forms/reducers/multiEditors'
import { testEditor, testFocusNodeState, testPropertyState, testState } from '../util'
import { propertyShape } from '../../../util'

describe('core/models/forms/reducers/multiEditors', () => {
  describe('selectMultiEditor', () => {
    it('selects first multi editor if no param given', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                editors: [testEditor(dash.MultiEditor1)],
              })],
            }),
          },
        },
      })

      // when
      const after = selectMultiEditor(state, {
        form,
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor1)
    })

    it('selects desired multi editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                editors: [testEditor(dash.MultiEditor1), testEditor(dash.MultiEditor2)],
              })],
            }),
          },
        },
      })

      // when
      const after = selectMultiEditor(state, {
        form,
        focusNode,
        property: shape,
        editor: dash.MultiEditor2,
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor2)
    })

    it('selects first multi editor if not found for id', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                editors: [testEditor(dash.MultiEditor1), testEditor(dash.MultiEditor2)],
              })],
            }),
          },
        },
      })

      // when
      const after = selectMultiEditor(state, {
        form,
        focusNode,
        property: shape,
        editor: dash.MultiEditor3,
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor1)
    })

    it('resets component state', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                editors: [testEditor(dash.MultiEditor1)],
                componentState: { foo: 'bar' },
              })],
            }),
          },
        },
      })

      // when
      const after = selectMultiEditor(state, {
        form,
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.componentState).to.deep.eq({})
    })
  })

  describe('selectSingleEditors', () => {
    it('selects first multi editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape.pointer, {
                selectedEditor: dash.MultiEditor1,
              })],
            }),
          },
        },
      })

      // when
      const after = selectSingleEditors(state, {
        form,
        focusNode,
        property: shape,
      })

      // then
      const propertyState = after.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.be.undefined
    })
  })
})
