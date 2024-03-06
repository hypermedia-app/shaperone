import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import setRoot from '@hydrofoil/shaperone-core/models/forms/effects/resources/setRoot.js'
import type { Store } from '@hydrofoil/shaperone-core/state'

const ex = $rdf.namespace('http://example.com/')

describe('models/forms/effects/resources/setRoot', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('pushes first focus node', () => {
    // given
    const rootPointer = $rdf.clownface().node(ex.Foo)

    // when
    setRoot(store)({
      form,
      rootPointer,
    })

    // then
    expect(store.getDispatch().forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
      form,
      replaceStack: true,
    }))
  })

  it('does nothing if the resource is same pointer', () => {
    // given
    const graph = $rdf.clownface()
    const initialFoo = graph.node(ex.Foo)
    const initialBar = graph.node(ex.Bar)
    store.getState().forms.get(form)!.focusStack = [initialFoo, initialBar]

    // when
    setRoot(store)({
      form,
      rootPointer: initialFoo,
    })

    // then
    expect(store.getDispatch().forms.createFocusNodeState).not.to.have.been.called
  })

  it('replaces current stack when resource changes', () => {
    // given
    const graph = $rdf.clownface()
    const initialFoo = graph.node(ex.Foo)
    const initialBar = graph.node(ex.Bar)
    store.getState().forms.get(form)!.focusStack = [initialFoo, initialBar]
    const rootPointer = $rdf.clownface().node(ex.Baz)

    // when
    setRoot(store)({
      form,
      rootPointer,
    })

    // then
    expect(store.getDispatch().forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
      form,
      focusNode: rootPointer,
      replaceStack: true,
    }))
  })
})
