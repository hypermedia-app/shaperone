import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testFocusNodeState, testObjectState, testPropertyState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { testEditorsState } from '@shaperone/testing/models/editors.js'
import { recalculateEditors, toggleSwitching, updateComponentState } from '@hydrofoil/shaperone-core/models/forms/reducers/editors.js'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'

describe('core/models/forms/reducers/editors', () => {
  describe('toggleSwitching', () => {
    it('can disable all editor switches', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const { form, state } = testState(undefined, {
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
      const { form, state } = testState(undefined, {
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
      const { form, state } = testState(undefined, {
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
      const { form, state } = testState(undefined, {
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

  describe('recalculateEditors', () => {
    it('sets editor to all objects which previously had none', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
      })
      const { state } = testState(undefined, {
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
        },
      })
      testState(state, {
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
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
      const objects = [...after.values()]
        .flatMap(form => Object.values(form.focusNodes))
        .flatMap(focusNode => focusNode.properties)
        .flatMap(property => property.objects)
      expect(objects).to.containAll<PropertyObjectState>(object => dash.TextFieldEditor.equals(object.selectedEditor))
    })

    it('sets multi editor if matched', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
      })
      const { state } = testState(undefined, {
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
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
      const properties = [...after.values()]
        .flatMap(form => Object.values(form.focusNodes))
        .flatMap(focusNode => focusNode.properties)
      expect(properties).to.containAll<PropertyState>(prop => dash.TextFieldEditor.equals(prop.selectedEditor))
    })

    it('does not change multi editor if previously selected', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'))],
        selectedEditor: dash.FooEditor,
      })
      const { state } = testState(undefined, {
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
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
      const properties = [...after.values()]
        .flatMap(form => Object.values(form.focusNodes))
        .flatMap(focusNode => focusNode.properties)
      expect(properties).to.containAll<PropertyState>(prop => property.selectedEditor === prop.selectedEditor)
    })

    it('does not change object editor if previously selected', () => {
      // given
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = new PropertyShapeMixin.Class(focusNode.blankNode())
      const property = testPropertyState(shape.pointer, {
        objects: [testObjectState(focusNode.literal('foo'), {
          selectedEditor: dash.TextFieldEditor,
        })],
      })
      const { state } = testState(undefined, {
        form: {
          focusNodes: {
            ...testFocusNodeState(focusNode, {
              properties: [property],
            }),
          },
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
      const objects = [...after.values()]
        .flatMap(form => Object.values(form.focusNodes))
        .flatMap(focusNode => focusNode.properties)
        .flatMap(prop => prop.objects)
      expect(objects).to.containAll<PropertyObjectState>(obj => obj.selectedEditor?.value === dash.TextFieldEditor.value)
    })
  })
})
