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

  beforeEach(() => {
    store = testStore()
  })

  it('pushes first focus node', () => {
    // given
    const rootPointer = $rdf.clownface().node(ex.Foo)

    // when
    setRoot(store)({
      rootPointer,
    })

    // then
    expect(store.getDispatch().form.createFocusNodeState).to.have.been.calledWith(sinon.match({
      replaceStack: true,
    }))
  })

  it('does nothing if the resource is same pointer', () => {
    // given
    const graph = $rdf.clownface()
    const initialFoo = graph.node(ex.Foo)
    const initialBar = graph.node(ex.Bar)
    store.getState().form.focusStack = [initialFoo, initialBar]

    // when
    setRoot(store)({
      rootPointer: initialFoo,
    })

    // then
    expect(store.getDispatch().form.createFocusNodeState).not.to.have.been.called
  })

  it('replaces current stack when resource changes', () => {
    // given
    const graph = $rdf.clownface()
    const initialFoo = graph.node(ex.Foo)
    const initialBar = graph.node(ex.Bar)
    store.getState().form.focusStack = [initialFoo, initialBar]
    const rootPointer = $rdf.clownface().node(ex.Baz)

    // when
    setRoot(store)({
      rootPointer,
    })

    // then
    const spy = store.getDispatch().form.createFocusNodeState as sinon.SinonSpy
    expect(spy.firstCall.firstArg).to.containSubset({
      focusNode: rootPointer,
      replaceStack: true,
    })
  })
})
