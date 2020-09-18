import { describe } from 'mocha'
import { expect } from 'chai'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { NodeShapeMixin } from '@rdfine/shacl'
import { selectShape } from '../../../../models/forms/reducers/selectShape'
import { testFocusNodeState, testState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/selectShape', () => {
  it('return original state if focus node is not found', () => {
    // given
    const { form, state: before } = testState()
    const focusNode = cf({ dataset: $rdf.dataset() }).node(ex.Foo)
    const shape = new NodeShapeMixin.Class(cf({ dataset: $rdf.dataset() }).node(ex.Shape))

    // when
    const after = selectShape(before, {
      form,
      shape,
      focusNode,
    })

    // then
    expect(after).to.eq(before)
  })

  it('replaces current shape with new', () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).node(ex.Foo)
    const { form, state: before } = testState({
      form: {
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            shape: new NodeShapeMixin.Class(cf({ dataset: $rdf.dataset() }).node(ex.OldShape)),
          }),
        },
      },
    })
    const shape = new NodeShapeMixin.Class(cf({ dataset: $rdf.dataset() }).node(ex.NewShape))

    // when
    const after = selectShape(before, {
      form,
      shape,
      focusNode,
    })

    // then
    const { focusNodes: { [ex.Foo.value]: formState } } = after.instances.get(form)!
    expect(formState.shape).to.eq(shape)
  })

  it('returns same focus node state if shape is equal pointer', () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).node(ex.Foo)
    const shape = new NodeShapeMixin.Class(cf({ dataset: $rdf.dataset() }).node(ex.Shape))
    const { form, state: before } = testState({
      form: {
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            shape,
          }),
        },
      },
    })

    // when
    const after = selectShape(before, {
      form,
      shape: new NodeShapeMixin.Class(cf({ dataset: $rdf.dataset() }).node(ex.Shape)),
      focusNode,
    })

    // then
    const { focusNodes: { [ex.Foo.value]: formState } } = after.instances.get(form)!
    expect(formState.shape).to.eq(shape)
  })
})
