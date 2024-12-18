import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@zazuko/env/web.js'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { testFocusNodeState, testPropertyState, testStore } from '@shaperone/testing/models/form.js'
import { addFormField } from '@hydrofoil/shaperone-core/models/forms/reducers/addFormField.js'
import { propertyShape } from '@shaperone/testing/util.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/forms/reducers/addObject', () => {
  it('updates canRemove flag', () => {
    // given
    const graph = $rdf.clownface()
    const property = propertyShape(graph.blankNode(), {
      minCount: 2,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: true,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides: undefined,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('updates canRemove flag when it is indeed reached', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      minCount: 1,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: false,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides: undefined,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('keep minReached when is lower than after adding a value', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      minCount: 0,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: false,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides: undefined,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].canRemove).to.eq(true)
  })

  it('adds state with correct editorSwitchDisabled flag', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: true,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides: undefined,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].objects[0].editorSwitchDisabled).to.be.true
  })

  it('adds state with passed nodeKind', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: true,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })
    const overrides = blankNode().addOut($rdf.ns.sh.nodeKind, $rdf.ns.sh.IRIOrLiteral)

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].objects[0].nodeKind).to.deep.eq($rdf.ns.sh.IRIOrLiteral)
  })

  it('sets overrides to state', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: true,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })
    const overrides = blankNode()

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [],
      selectedEditor: undefined,
      overrides,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].objects[0].overrides).to.eq(overrides)
  })

  it('initializes with state with preferred editor and adds it as first choice', () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      path: ex.prop,
      editor: dash.FooEditor,
    })
    const focusNode = graph.node(ex.FocusNode)
    const store = testStore()
    const { form } = store.getState()

    form.focusNodes = testFocusNodeState(focusNode, {
      properties: [testPropertyState(focusNode.blankNode(), {
        canRemove: true,
        canAdd: true,
        name: 'prop',
        shape: property,
        selectedEditor: undefined,
        objects: [],
      })],
    })

    // when
    const after = addFormField(form, {
      property,
      focusNode,
      editors: [{
        term: dash.FooEditor,
        score: 100,
        meta: {} as any,
      }, {
        term: dash.TextFieldEditor,
        score: 10,
        meta: {} as any,
      }],
      selectedEditor: dash.FooEditor,
      overrides: undefined,
      componentState: undefined,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after
    expect(fooState.properties[0].objects[0].selectedEditor).to.deep.eq(dash.FooEditor)
    expect(fooState.properties[0].objects[0].editors[0].term).to.deep.eq(dash.FooEditor)
    expect(fooState.properties[0].objects[0].editors[1].term).to.deep.eq(dash.TextFieldEditor)
  })
})
