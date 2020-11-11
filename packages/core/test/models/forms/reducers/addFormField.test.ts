import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { testState } from '../util'
import { addFormField } from '../../../../models/forms/reducers/addFormField'
import { propertyShape } from '../../../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/addObject', () => {
  it('updates canRemove flag', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
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
    const after = addFormField(before, {
      form,
      property,
      focusNode,
      editors: [],
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('updates canRemove flag when it is indeed reached', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
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
    const after = addFormField(before, {
      form,
      property,
      focusNode,
      editors: [],
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(false)
  })

  it('keep minReached when is lower than after adding a value', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
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
    const after = addFormField(before, {
      form,
      property,
      focusNode,
      editors: [],
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].canRemove).to.eq(true)
  })

  it('adds state with correct editorSwitchDisabled flag', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
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
    const after = addFormField(before, {
      form,
      property,
      focusNode,
      editors: [],
    })

    // then
    const { focusNodes: { [ex.FocusNode.value]: fooState } } = after.instances.get(form)!
    expect(fooState.properties[0].objects[0].editorSwitchDisabled).to.be.true
  })
})
