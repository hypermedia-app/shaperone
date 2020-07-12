import { describe, it } from 'mocha'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { dash } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { selectMultiEditor, selectSingleEditors } from '../../../../models/forms/reducers/multiEditors'
import { testEditor, testFocusNodeState, testPropertyState, testState } from '../util'

describe('core/models/forms/reducers/multiEditors', () => {
  describe('selectMultiEditor', () => {
    it('selects first multi editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape._selfGraph, {
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
      const propertyState = after.instances.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.deep.eq(dash.MultiEditor1)
    })
  })

  describe('selectSingleEditors', () => {
    it('selects first multi editor', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const { form, state } = testState({
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [testPropertyState(shape._selfGraph, {
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
      const propertyState = after.instances.get(form)!.focusNodes[focusNode.value].properties[0]
      expect(propertyState.selectedEditor).to.be.undefined
    })
  })
})
