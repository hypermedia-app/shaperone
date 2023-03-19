import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import ns from '@rdfjs/namespace'
import { sinon } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import setGraph from '@hydrofoil/shaperone-core/models/forms/effects/shapes/setGraph.js'
import { Store } from '@hydrofoil/shaperone-core/state'

const ex = ns('http://example.com/')

describe('models/forms/effects/shapes/setGraph', () => {
  let store: Store
  let form: symbol

  beforeEach(() => {
    ({ form, store } = testStore())
  })

  it('creates focus nodes state for focus stack', () => {
    // given
    const resourceGraph = cf({ dataset: $rdf.dataset() })
    const shapesGraph = cf({ dataset: $rdf.dataset() })
    shapesGraph.node(ex.Shape).addOut(rdf.type, sh.Shape).addOut(sh.targetNode, [ex.Foo, ex.Bar])
    const formState = store.getState().forms.get(form)!
    formState.focusStack = [
      resourceGraph.node(ex.Foo),
      resourceGraph.node(ex.Bar),
    ]

    // when
    setGraph(store)({
      form,
      shapesGraph: shapesGraph.dataset,
    })

    // then
    formState.focusStack.forEach((focusNode) => {
      expect(store.getDispatch().forms.createFocusNodeState).to.have.been.calledWith(sinon.match({
        form,
        focusNode,
      }))
    })
  })
})
