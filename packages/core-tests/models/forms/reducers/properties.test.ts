import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { blankNode } from '@shaperone/testing/nodeFactory'
import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import { sh } from '@tpluscode/rdf-ns-builders'
import { hideProperty, showProperty } from '@hydrofoil/shaperone-core/models/forms/reducers/properties'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FocusNode } from '@hydrofoil/shaperone-core/index'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

describe('@hydrofoil/shaperone-core/models/forms/reducers/properties', () => {
  let store: Store
  let form: symbol
  let focusNode: FocusNode

  beforeEach(() => {
    ({ form, store } = testStore())
    focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
  })

  describe('hideProperty', () => {
    it('hides property shape itself', () => {
      // given
      const property = testPropertyState()
      store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
        properties: [property],
      })

      // when
      const after = hideProperty(store.getState().forms, { form, focusNode, shape: property.shape })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].hidden).to.be.true
    })

    it('hides property shapes of given node shape', () => {
      // given
      const shape = blankNode()
        .addOut(sh.property)
        .addOut(sh.property)
        .addOut(sh.property)
      store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
        properties: shape.out(sh.property).map((node: any) => testPropertyState(node)),
      })

      // when
      const after = hideProperty(store.getState().forms, { form, focusNode, shape: fromPointer(shape) })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties).to.containAll<PropertyState>(shape => shape.hidden)
    })
  })

  describe('showProperty', () => {
    it('show property shape itself', () => {
      // given
      const property = testPropertyState(blankNode(), {
        hidden: true,
      })
      store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
        properties: [property],
      })

      // when
      const after = showProperty(store.getState().forms, { form, focusNode, shape: property.shape })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].hidden).to.be.false
    })

    it('show property shapes of given node shape', () => {
      // given
      const shape = blankNode()
        .addOut(sh.property)
        .addOut(sh.property)
        .addOut(sh.property)
      store.getState().forms.get(form)!.focusNodes = testFocusNodeState(focusNode, {
        properties: shape.out(sh.property).map((node: any) => testPropertyState(node, { hidden: true })),
      })

      // when
      const after = showProperty(store.getState().forms, { form, focusNode, shape: fromPointer(shape) })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties).to.containAll<PropertyState>(shape => !shape.hidden)
    })
  })
})
