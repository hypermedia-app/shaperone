/// <reference types="@types/chai-subset" />
import { describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import { expect } from 'chai'
import { testStore } from '@shaperone/testing/models/form.js'
import setGraph from '@hydrofoil/shaperone-core/models/forms/effects/shapes/setGraph.js'
import type { Store } from '@hydrofoil/shaperone-core/state'

const ex = $rdf.namespace('http://example.com/')

describe('models/forms/effects/shapes/setGraph', () => {
  let store: Store

  beforeEach(() => {
    store = testStore()
  })

  it('creates focus nodes state for focus stack', () => {
    // given
    const resourceGraph = $rdf.clownface()
    const shapesGraph = $rdf.clownface()
    shapesGraph.node(ex.Shape).addOut(rdf.type, sh.Shape).addOut(sh.targetNode, [ex.Foo, ex.Bar])
    const formState = store.getState().form
    formState.focusStack = [
      resourceGraph.node(ex.Foo),
      resourceGraph.node(ex.Bar),
    ]

    // when
    setGraph(store)()

    // then
    const spy = store.getDispatch().form.createFocusNodeState as sinon.SinonSpy
    expect(spy.getCalls().map(c => c.firstArg)).to.containSubset([
      { focusNode: resourceGraph.node(ex.Foo) },
      { focusNode: resourceGraph.node(ex.Bar) },
    ])
  })
})
