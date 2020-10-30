import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { literal } from '@rdf-esm/data-model'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { schema, sh } from '@tpluscode/rdf-ns-builders'
import { testState } from '../util'
import { addObject } from '../../../../models/forms/reducers/addObject'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/addObject', () => {
  it('updates canRemove flag', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      minCount: 2,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: true,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
      object,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('updates canRemove flag when it is indeed reached', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      minCount: 1,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: false,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
      object,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('keep minReached when is lower than after adding a value', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      minCount: 0,
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: false,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
      object,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(true)
  })

  it('adds triple for sh:defaultValue', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      path: schema.name,
      [sh.defaultValue.value]: literal('John Doe', 'en'),
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: false,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.focusNode.out(schema.name).term).to.deep.eq(literal('John Doe', 'en'))
  })

  it('adds triple for new blank node object', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      path: schema.knows,
      nodeKind: sh.BlankNode,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: false,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.focusNode.out(schema.knows).term?.termType).to.eq('BlankNode')
  })

  it('adds triple for new IRI node object', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      path: schema.knows,
      nodeKind: sh.IRI,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => true,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: false,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.focusNode.out(schema.knows).term?.termType).to.eq('NamedNode')
  })

  it('adds state with correct editorSwitchDisabled flag', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      path: ex.prop,
    })
    const focusNode = graph.node(ex.FocusNode)
    const { form, state: before } = testState({
      form: {
        shouldEnableEditorChoice: () => false,
        focusNodes: {
          [ex.FocusNode.value]: {
            focusNode,
            shapes: [],
            groups: [],
            properties: [{
              canRemove: true,
              canAdd: true,
              name: 'prop',
              shape: property,
              selectedEditor: undefined,
              objects: [],
            }],
          },
        },
      },
    })

    // when
    const after = addObject(before, {
      form,
      property,
      focusNode,
      object,
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].objects[0].editorSwitchDisabled).to.be.true
  })
})
