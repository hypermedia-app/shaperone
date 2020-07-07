import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdfjs/namespace'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { testState } from '../util'
import { addObject } from '../../../../models/forms/reducers/addObject'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/addObject', () => {
  it('updates canRemove flag', () => {
    // given
    const form = {}
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      [sh.minCount.value]: 2,
    })
    const focusNode = graph.node(ex.FocusNode)
    const before = testState(form, {
      form: {
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
              compoundEditors: [],
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
    const form = {}
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      [sh.minCount.value]: 1,
    })
    const focusNode = graph.node(ex.FocusNode)
    const before = testState(form, {
      form: {
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
              compoundEditors: [],
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
    const form = {}
    const graph = cf({ dataset: $rdf.dataset() })
    const object = graph.literal('foo')
    const property = new PropertyShapeMixin.Class(graph.blankNode(), {
      [sh.minCount.value]: 0,
    })
    const focusNode = graph.node(ex.FocusNode)
    const before = testState(form, {
      form: {
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
              compoundEditors: [],
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
})
