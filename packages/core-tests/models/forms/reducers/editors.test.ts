import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testFocusNodeState, testObjectState, testPropertyState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { testEditorsState } from '@shaperone/testing/models/editors.js'
import { recalculateEditors, toggleSwitching } from '@hydrofoil/shaperone-core/models/forms/reducers/editors.js'
import type { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'

describe('core/models/forms/reducers/editors', () => {
  describe('toggleSwitching', () => {
    it('can disable all editor switches', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const state = testState({
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
      })

      // when
      const after = toggleSwitching(state, { switchingEnabled: false })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.objects).to.containAll((o: PropertyObjectState) => o.editorSwitchDisabled === true)
    })

    it('can enable all editor switches', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const state = testState({
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
      })

      // when
      const after = toggleSwitching(state, { switchingEnabled: true })

      // then
      const propertyState = after.focusNodes[focusNode.value].properties[0]
      expect(propertyState.objects).to.containAll((o: PropertyObjectState) => o.editorSwitchDisabled === false)
    })
  })

  describe('recalculateEditors', () => {
    it('sets editor to all objects which previously had none', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
      })
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [property],
          }),
        },
      })
      const editors = testEditorsState({
        matchSingleEditors: () => [{
          term: dash.TextFieldEditor,
        }],
      })

      // when
      const after = recalculateEditors(state, { editors })

      // then
      const objects = Object.values(after.focusNodes)
        .flatMap(focusNode => focusNode.properties)
        .flatMap(property => property.objects)
      expect(objects).to.containAll((object: PropertyObjectState) => dash.TextFieldEditor.equals(object.selectedEditor))
    })

    it('sets multi editor if matched', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
      })
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [property],
          }),
        },
      })
      const editors = testEditorsState({
        matchMultiEditors: () => [{
          term: dash.TextFieldEditor,
        }],
      })

      // when
      const after = recalculateEditors(state, { editors })

      // then
      const properties = Object.values(after.focusNodes)
        .flatMap(focusNode => focusNode.properties)
      expect(properties).to.containAll((prop: PropertyState) => dash.TextFieldEditor.equals(prop.selectedEditor))
    })

    it('does not change multi editor if previously selected', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
        selectedEditor: dash.FooEditor,
      })
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [property],
          }),
        },
      })
      const editors = testEditorsState({
        matchMultiEditors: () => [{
          term: dash.BarEditor,
        }],
      })

      // when
      const after = recalculateEditors(state, { editors })

      // then
      const properties = Object.values(after.focusNodes)
        .flatMap(focusNode => focusNode.properties)
      expect(properties).to.containAll((prop: PropertyState) => property.selectedEditor === prop.selectedEditor)
    })

    it('does not change object editor if previously selected', () => {
      // given
      const focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      const shape = $rdf.rdfine.sh.PropertyShape(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'), {
          selectedEditor: dash.TextFieldEditor,
        })],
      })
      const state = testState({
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            properties: [property],
          }),
        },
      })
      const editors = testEditorsState({
        matchSingleEditors: () => [{
          term: dash.TextAreaEditor,
        }],
      })

      // when
      const after = recalculateEditors(state, { editors })

      // then
      const objects = Object.values(after.focusNodes)
        .flatMap(focusNode => focusNode.properties)
        .flatMap(prop => prop.objects)
      expect(objects).to.containAll((obj: PropertyObjectState) => obj.selectedEditor?.value === dash.TextFieldEditor.value)
    })
  })
})
