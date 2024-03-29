import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@shaperone/testing/env.js'
import { rdf, rdfs, sh } from '@tpluscode/rdf-ns-builders'
import { testStore } from '@shaperone/testing/models/form.js'
import { setGraph } from '@hydrofoil/shaperone-core/models/shapes/reducers.js'

const ex = $rdf.namespace('http://example.com/')

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
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })

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
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })
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

  it('sets new preferred shape if it was selected from same dataset', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })
    shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
    shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')
    before.get(form)!.shapesGraph = shapesGraph
    before.get(form)!.preferredRootShape = $rdf.rdfine.sh.NodeShape(shapesGraph.node(ex.Shape1))

    // when
    const after = setGraph(before, {
      form,
      shapesGraph: shapesGraph.node(ex.Shape2),
    })

    // then
    const { preferredRootShape } = after.get(form)!
    expect(preferredRootShape?.id).to.deep.eq(ex.Shape2)
  })

  it('does not modify state if it is same dataset and no pointer', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes.get(form)!
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })
    before.shapesGraph = shapesGraph

    // when
    const after = setGraph(store.getState().shapes, {
      form,
      shapesGraph,
    })

    // then
    expect(after.get(form) === before).to.be.true
  })

  it('does not change shapes array if only pointer changes', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes.get(form)!
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })
    shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
    shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')
    before.shapesGraph = shapesGraph
    before.preferredRootShape = $rdf.rdfine.sh.NodeShape(shapesGraph.node(ex.Shape1))

    // when
    const after = setGraph(store.getState().shapes, {
      form,
      shapesGraph: shapesGraph.node(ex.Shape2),
    })

    // then
    expect(after.get(form)?.shapes === before.shapes).to.be.false
  })

  it('sets preferred root shape is parameter is graph pointer', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = $rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Graph })
    shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
    shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')

    // when
    const after = setGraph(before, {
      form,
      shapesGraph: shapesGraph.node(ex.Shape2),
    })

    // then
    const { preferredRootShape } = after.get(form)!
    expect(preferredRootShape?.id).to.deep.eq(ex.Shape2)
  })

  it('extracts shape resources from graph', () => {
    // given
    const { form, store } = testStore()
    const before = store.getState().shapes
    const shapesGraph = $rdf.clownface()
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
