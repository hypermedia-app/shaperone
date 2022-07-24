import { describe } from 'mocha'
import { expect } from 'chai'
import ns from '@rdf-esm/namespace'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import { testFocusNodeState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { selectShape } from '@hydrofoil/shaperone-core/models/forms/reducers/selectShape.js'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/selectShape', () => {
  it('return original state if focus node is not found', () => {
    // given
    const { form, state: before } = testState()
    const focusNode = cf({ dataset: $rdf.dataset() }).node(ex.Foo)
    const shape = fromPointer(cf({ dataset: $rdf.dataset() }).node(ex.Shape))

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
            shape: fromPointer(cf({ dataset: $rdf.dataset() }).node(ex.OldShape)),
          }),
        },
      },
    })
    const shape = fromPointer(cf({ dataset: $rdf.dataset() }).node(ex.NewShape))

    // when
    const after = selectShape(before, {
      form,
      shape,
      focusNode,
    })

    // then
    const { focusNodes: { [ex.Foo.value]: formState } } = after.get(form)!
    expect(formState.shape).to.eq(shape)
  })

  it('returns same focus node state if shape is equal pointer', () => {
    // given
    const focusNode = cf({ dataset: $rdf.dataset() }).node(ex.Foo)
    const shape = fromPointer(cf({ dataset: $rdf.dataset() }).node(ex.Shape))
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
      shape: fromPointer(cf({ dataset: $rdf.dataset() }).node(ex.Shape)),
      focusNode,
    })

    // then
    const { focusNodes: { [ex.Foo.value]: formState } } = after.get(form)!
    expect(formState.shape).to.eq(shape)
  })
})
