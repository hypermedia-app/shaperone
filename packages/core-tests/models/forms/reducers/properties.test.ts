import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form.js'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { hideProperty, showProperty } from '@hydrofoil/shaperone-core/models/forms/reducers/properties.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import type { FocusNode } from '@hydrofoil/shaperone-core/index.js'
import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

describe('@hydrofoil/shaperone-core/models/forms/reducers/properties', () => {
  let store: Store
  let form: symbol
  let focusNode: FocusNode

  beforeEach(() => {
    ({ form, store } = testStore())
    focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
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
      const after = hideProperty(store.getState().forms, { form, focusNode, shape: $rdf.rdfine.sh.NodeShape(shape) })

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
      const after = showProperty(store.getState().forms, { form, focusNode, shape: $rdf.rdfine.sh.NodeShape(shape) })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties).to.containAll<PropertyState>(shape => !shape.hidden)
    })
  })
})
