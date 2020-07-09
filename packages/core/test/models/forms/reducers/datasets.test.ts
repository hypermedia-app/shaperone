import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import cf from 'clownface'
import ns from '@rdfjs/namespace'
import { rdf, sh, rdfs } from '@tpluscode/rdf-ns-builders'
import { ShapeMixin } from '@rdfine/shacl'
import { setShapesGraph, setRootResource } from '../../../../models/forms/reducers/datasets'
import { testState } from '../util'

const ex = ns('http://example.com/')

describe('core/models/forms/reducers/datasets', () => {
  describe('setShapesGraph', () => {
    it('sets dataset to state', () => {
      // given
      const { form, state } = testState()
      const shapesGraph = $rdf.dataset()

      // when
      const after = setShapesGraph(state, {
        form,
        shapesGraph,
      })

      // then
      expect(after.instances.get(form)!.shapesGraph).to.eq(shapesGraph)
    })

    it('extracts shape resources from graph', () => {
      // given
      const { form, state } = testState()
      const shapesGraph = cf({ dataset: $rdf.dataset() })
      shapesGraph.node(ex.Shape1).addOut(rdf.type, sh.Shape).addOut(rdfs.label, 'Shape one')
      shapesGraph.node(ex.Shape2).addOut(rdf.type, sh.NodeShape).addOut(rdfs.label, 'Shape two')

      // when
      const after = setShapesGraph(state, {
        form,
        shapesGraph: shapesGraph.dataset,
      })

      // then
      const { shapes } = after.instances.get(form)!
      expect(shapes.length).to.eq(2)
      expect(shapes.map(s => s.label)).to.include('Shape one')
      expect(shapes.map(s => s.label)).to.include('Shape two')
    })

    it('creates focus nodes state for focus stack', () => {
      // given
      const { form, state } = testState()
      const resourceGraph = cf({ dataset: $rdf.dataset() })
      const shapesGraph = cf({ dataset: $rdf.dataset() })
      shapesGraph.node(ex.Shape).addOut(rdf.type, sh.Shape).addOut(sh.targetNode, [ex.Foo, ex.Bar])
      const formState = state.instances.get(form)!
      formState.focusStack = [
        resourceGraph.node(ex.Foo),
        resourceGraph.node(ex.Bar),
      ]

      // when
      const after = setShapesGraph(state, {
        form,
        shapesGraph: shapesGraph.dataset,
      })

      // then
      const { focusNodes } = after.instances.get(form)!
      expect(focusNodes[ex.Foo.value]).to.be.ok
      expect(focusNodes[ex.Bar.value]).to.be.ok
    })

    it('updates existing focus node states', () => {
      // given
      const { form, state } = testState()
      const shapesGraph = cf({ dataset: $rdf.dataset() })
      const shapes = [new ShapeMixin.Class(shapesGraph.node(ex.Shape))]
      const resourceGraph = cf({ dataset: $rdf.dataset() })
      const focusNode = resourceGraph.node(ex.Foo)
      const formState = state.instances.get(form)!
      formState.focusNodes = {
        [ex.Foo.value]: {
          shapes,
          properties: [],
          groups: [],
          focusNode,
        },
      }

      // when
      const after = setShapesGraph(state, {
        form,
        shapesGraph: shapesGraph.dataset,
      })

      // then
      const { focusNodes } = after.instances.get(form)!
      const fooState = focusNodes[ex.Foo.value]
      expect(fooState).to.be.ok
      expect(fooState).not.to.eq(formState.focusNodes[ex.Foo.value])
    })
  })

  describe('setRootResource', () => {
    it('pushes first focus node', () => {
      // given
      const { form, state } = testState()
      const rootPointer = cf({ dataset: $rdf.dataset() }).node(ex.Foo)

      // when
      const after = setRootResource(state, {
        form,
        rootPointer,
      })

      // then
      const { focusStack } = after.instances.get(form)!
      expect(focusStack).to.include(rootPointer)
    })

    it('sets dataset to state', () => {
      // given
      const dataset = $rdf.dataset()
      const graph = cf({ dataset })
      const { form, state } = testState()

      // when
      const after = setRootResource(state, {
        form,
        rootPointer: graph.node(ex.Foo),
      })

      // then
      const { resourceGraph } = after.instances.get(form)!
      expect(resourceGraph).to.eq(dataset)
    })

    it('replaces current stack when resource changes', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { form, state } = testState()
      const initialFoo = graph.node(ex.Foo)
      const initialBar = graph.node(ex.Bar)
      state.instances.get(form)!.focusStack = [initialFoo, initialBar]

      // when
      const after = setRootResource(state, {
        form,
        rootPointer: cf({ dataset: $rdf.dataset() }).node(ex.Foo),
      })

      // then
      const { focusStack } = after.instances.get(form)!
      expect(focusStack.length).to.eq(1)
      expect(focusStack[0].value).to.eq(ex.Foo.value)
      expect(focusStack[0]).not.to.eq(initialFoo)
    })

    it('does nothing if the resource is same pointer', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { form, state: before } = testState()
      const initialFoo = graph.node(ex.Foo)
      const initialBar = graph.node(ex.Bar)
      before.instances.get(form)!.focusStack = [initialFoo, initialBar]

      // when
      const after = setRootResource(before, {
        form,
        rootPointer: initialFoo,
      })

      // then
      expect(after).to.eq(before)
    })

    it('populates focus node state for root node', () => {
      // given
      const { form, state } = testState()
      const formState = state.instances.get(form)!
      const shapeGraph = cf({ dataset: $rdf.dataset() })
      formState.shapes.push(new ShapeMixin.Class(shapeGraph.node(ex.Shape), {
        targetClass: ex.FooClass,
      }))
      const rootPointer = cf({ dataset: $rdf.dataset() })
        .node(ex.Foo)
        .addOut(rdf.type, ex.FooClass)

      // when
      const after = setRootResource(state, {
        form,
        rootPointer,
      })

      // then
      const { focusNodes } = after.instances.get(form)!
      const node = focusNodes[ex.Foo.value]
      expect(node.focusNode.value).to.equal(ex.Foo.value)
    })
  })
})
