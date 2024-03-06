import { describe } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { testFocusNodeState, testFormState as testState } from '@shaperone/testing/models/form.js'
import { selectShape } from '@hydrofoil/shaperone-core/models/forms/reducers/selectShape.js'

const ex = $rdf.namespace('http://example.com/')

describe('core/models/forms/reducers/selectShape', () => {
  it('return original state if focus node is not found', () => {
    // given
    const { form, state: before } = testState()
    const focusNode = $rdf.clownface().node(ex.Foo)
    const shape = $rdf.rdfine.sh.NodeShape($rdf.clownface().node(ex.Shape))

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
    const focusNode = $rdf.clownface().node(ex.Foo)
    const { form, state: before } = testState(undefined, {
      form: {
        focusNodes: {
          ...testFocusNodeState(focusNode, {
            shape: $rdf.rdfine.sh.NodeShape($rdf.clownface()
              .node(ex.OldShape)),
          }),
        },
      },
    })
    const shape = $rdf.rdfine.sh.NodeShape($rdf.clownface().node(ex.NewShape))

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
    const focusNode = $rdf.clownface().node(ex.Foo)
    const shape = $rdf.rdfine.sh.NodeShape($rdf.clownface().node(ex.Shape))
    const { form, state: before } = testState(undefined, {
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
      shape: $rdf.rdfine.sh.NodeShape($rdf.clownface().node(ex.Shape)),
      focusNode,
    })

    // then
    const { focusNodes: { [ex.Foo.value]: formState } } = after.get(form)!
    expect(formState.shape).to.eq(shape)
  })
})
