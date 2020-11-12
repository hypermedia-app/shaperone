import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import ns from '@rdf-esm/namespace'
import { rdf, rdfs, sh } from '@tpluscode/rdf-ns-builders'
import { setGraph } from '../../../../models/shapes/reducers'
import { testStore } from '../../forms/util'

const ex = ns('http://example.com/')

describe('models/shapes/reducers/setGraph', () => {
  it('sets dataset to state', () => {
    // given
    const shapesGraph = $rdf.dataset()
    const { form, store } = testStore()
    const before = store.getState().shapes

    // when
    const after = setGraph(before, {
      form,
      shapesGraph,
    })

    // then
    expect(after.get(form)?.shapesGraph?.dataset).to.eq(shapesGraph)
  })

  it('sets pointer to state', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = cf({ dataset: $rdf.dataset(), graph: ex.Graph })

    // when
    const after = setGraph(before, {
      form,
      shapesGraph,
    })

    // then
    expect(after.get(form)?.shapesGraph?.dataset).to.eq(shapesGraph.dataset)
    expect(after.get(form)?.shapesGraph?._context[0].graph).to.deep.eq(ex.Graph)
  })

  it('extracts shapes from a pointer', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = cf({ dataset: $rdf.dataset(), graph: ex.Graph })
    shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
    shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')

    // when
    const after = setGraph(before, {
      form,
      shapesGraph,
    })

    // then
    const { shapes } = after.get(form)!
    expect(shapes.length).to.eq(2)
    expect(shapes.map(s => s.label)).to.include('Shape one')
    expect(shapes.map(s => s.label)).to.include('Shape two')
  })

  it('extracts shape resources from graph', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = cf({ dataset: $rdf.dataset() })
    shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
    shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')

    // when
    const after = setGraph(before, {
      form,
      shapesGraph: shapesGraph.dataset,
    })

    // then
    const { shapes } = after.get(form)!
    expect(shapes.length).to.eq(2)
    expect(shapes.map(s => s.label)).to.include('Shape one')
    expect(shapes.map(s => s.label)).to.include('Shape two')
  })
})
