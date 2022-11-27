import { describe, it } from 'mocha'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { RecursivePartial, sinon } from '@shaperone/testing'
import { testObjectState, testStore } from '@shaperone/testing/models/form.js'
import {
  clearValue,
  setDefaultValue,
  initObjectValue,
  setPropertyObjects,
} from '@hydrofoil/shaperone-core/models/forms/reducers/updateObject.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { propertyShape } from '@shaperone/testing/util.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/updateObject', () => {
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

  describe('setPropertyObjects', () => {
    it('removes all current objects and creates new', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
        .addOut(ex.prop, ['foo1', 'foo2'])
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [],
            name: 'prop',
            canRemove: true,
            canAdd: true,
            editors: [],
            selectedEditor: undefined,
          }],
        },
      }

      // when
      const after = setPropertyObjects(store.getState().forms, {
        focusNode,
        form,
        property,
        editors: store.getState().editors,
        objects: graph.node([$rdf.literal('bar1'), $rdf.literal('bar2'), $rdf.literal('bar3')]),
      })

      // then
      const { focusNodes: { [focusNode.value]: focusNodeState } } = after.get(form)!
      const values = focusNodeState.properties[0].objects.map(os => os.object?.value)
      expect(values).to.have.length(3)
      expect(values).to.include.members(['bar1', 'bar2', 'bar3'])
    })

    it('flips canAdd flag when max reached', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
        maxCount: 2,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            canAdd: true,
          }],
        },
      }

      // when
      const after = setPropertyObjects(store.getState().forms, {
        focusNode,
        form,
        property,
        editors: testStore().store.getState().editors,
        objects: graph.node([$rdf.literal('foo'), $rdf.literal('bar')]),
      })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].canAdd).to.be.false
    })

    it('sets canRemove flag when min reached', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
        minCount: 2,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            canRemove: true,
          }],
        },
      }

      // when
      const after = setPropertyObjects(store.getState().forms, {
        focusNode,
        form,
        property,
        editors: testStore().store.getState().editors,
        objects: graph.node([$rdf.literal('foo')]),
      })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].canRemove).to.be.false
    })

    it('sets canAdd/canRemove flags to true', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.FocusNode)
      const property = propertyShape(graph.blankNode(), {
        path: ex.prop,
        minCount: 1,
        maxCount: 4,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            canAdd: false,
            canRemove: false,
          }],
        },
      }

      // when
      const after = setPropertyObjects(store.getState().forms, {
        focusNode,
        form,
        property,
        editors: testStore().store.getState().editors,
        objects: graph.node([$rdf.literal('foo'), $rdf.literal('bar')]),
      })

      // then
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].canAdd).to.be.true
      expect(after.get(form)?.focusNodes[focusNode.value].properties[0].canRemove).to.be.true
    })
  })

  describe('initObjectValue', () => {
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
      initObjectValue(store.getState().forms, {
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
      const afterState = initObjectValue(store.getState().forms, {
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

  describe('setDefaultValue', () => {
    it('sets object pointers to object state without value', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const emptyObject = testObjectState()
      const notEmptyObject = testObjectState(graph.literal('10'))
      const focusNode = graph.blankNode()
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [
              emptyObject,
              notEmptyObject,
            ],
          }],
        },
      }

      // when
      const value = graph.literal('foo', 'bar')
      const afterState = setDefaultValue(store.getState().forms, {
        focusNode,
        property,
        form,
        editors: store.getState().editors,
        value,
      })

      // then
      const objectsAfter = afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects
      expect(objectsAfter?.[1].object?.term).to.deep.equal($rdf.literal('10'))
      expect(objectsAfter?.[0].object?.term).to.deep.equal($rdf.literal('foo', 'bar'))
    })

    it('selects appropriate editor to default object', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const emptyObject = testObjectState()
      const notEmptyObject = testObjectState(graph.literal('10'), {
        selectedEditor: dash.FooEditor,
      })
      const focusNode = graph.blankNode()
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [
              emptyObject,
              notEmptyObject,
            ],
          }],
        },
      }
      const { editors } = store.getState()
      editors.matchSingleEditors = sinon.stub().returns([{
        score: 10,
        term: dash.BarEditor,
      }])

      // when
      const value = graph.literal('foo', 'bar')
      const afterState = setDefaultValue(store.getState().forms, {
        focusNode,
        property,
        form,
        editors,
        value,
      })

      // then
      const objectsAfter = afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects
      expect(objectsAfter?.[1].selectedEditor?.value).to.deep.equal(dash.FooEditor.value)
      expect(objectsAfter?.[0].selectedEditor).to.deep.equal(dash.BarEditor)
    })

    it('keeps dash:editor override', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape()
      const emptyObject = testObjectState(undefined, {
        overrides: blankNode().addOut(dash.editor, dash.BazEditor),
      })
      const focusNode = graph.blankNode()
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: [
              emptyObject,
            ],
          }],
        },
      }
      const { editors } = store.getState()
      editors.matchSingleEditors = sinon.stub().returns([{
        score: 10,
        term: dash.BarEditor,
      }])

      // when
      const value = graph.literal('foo', 'bar')
      const afterState = setDefaultValue(store.getState().forms, {
        focusNode,
        property,
        form,
        editors,
        value,
      })

      // then
      const objectsAfter = afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects
      expect(objectsAfter?.[0].selectedEditor).to.deep.equal(dash.BazEditor)
    })
  })

  describe('clearValue', () => {
    it('sets object state value to undefined', () => {
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
      const afterState = clearValue(store.getState().forms, {
        focusNode,
        property,
        form,
        object,
      })

      // then
      const objectsAfter = afterState.get(form)?.focusNodes[focusNode.value].properties[0].objects
      expect(objectsAfter?.[0].object).to.be.undefined
    })
  })
})
