import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdfjs/namespace'
import { NodeShapeMixin } from '@rdfine/shacl'
import { schema, sh, dash } from '@tpluscode/rdf-ns-builders'
import { initialiseFocusNode } from '../../../../models/forms/lib/stateBuilder'

const ex = ns('http://example.com/')

describe('core/models/forms/lib/stateBuilder', () => {
  describe('initialiseFocusNode', () => {
    it('positions explicitly selected shape at the head of shapes array', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const nestedShape = new NodeShapeMixin.Class(graph.namedNode(ex.nestedNode))
      const otherShape = new NodeShapeMixin.Class(graph.namedNode(ex.otherNode))

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        shape: nestedShape,
        shapes: [otherShape],
      })

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.shapes).to.contain.ordered.members([nestedShape, otherShape])
    })

    it('does not reposition selected shape if it already', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const nestedShape = new NodeShapeMixin.Class(graph.namedNode(ex.nestedNode))
      const otherShape = new NodeShapeMixin.Class(graph.namedNode(ex.otherNode))

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        shape: nestedShape,
        shapes: [otherShape, nestedShape],
      })

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.shapes).to.contain.ordered.members([otherShape, nestedShape])
    })

    it('sets canRemove=false when object count equals sh:minCount', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
        .addOut(schema.age, 21)
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: schema.age,
          types: [sh.PropertyShape],
          [sh.minCount.value]: 1,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        shape,
        shapes: [],
      })

      // then
      expect(state.properties[0].canRemove).to.be.false
    })

    it('sets canRemove=false when object count is less than sh:minCount', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
        .addOut(schema.age, 21)
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: schema.age,
          types: [sh.PropertyShape],
          [sh.minCount.value]: 2,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        shape,
        shapes: [],
      })

      // then
      expect(state.properties[0].canRemove).to.be.false
    })

    it('selects the editor preferred by dash:editor', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo).addOut(ex.foo, 'bar')
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          [dash.editor.value]: ex.FooEditor,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        shape,
        shapes: [],
      })

      // then
      expect(state.properties[0].objects[0].selectedEditor).to.deep.eq(ex.FooEditor)
    })

    it('add the editor preferred by sh:editor to possible choices', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo).addOut(ex.foo, 'bar')
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          [dash.editor.value]: ex.FooEditor,
        }],
      })
      const fooEditor = {
        term: ex.FooEditor,
        match: () => 0,
      }

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [fooEditor],
        shape,
        shapes: [],
      })

      // then
      expect(state.properties[0].objects[0].editors[0].term).to.deep.equal(ex.FooEditor)
    })

    it('does not add the preferred editor second time', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo).addOut(ex.foo, 'bar')
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          [dash.editor.value]: ex.FooEditor,
        }],
      })
      const fooEditor = {
        term: ex.FooEditor,
        match: () => 5,
      }
      const barEditor = {
        term: ex.BarEditor,
        match: () => 10,
      }

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [fooEditor, barEditor],
        shape,
        shapes: [],
      })

      // then
      expect(state.properties[0].objects[0].editors).to.have.length(2)
      expect(state.properties[0].objects[0].editors[0].term).to.deep.equal(ex.FooEditor)
    })
  })
})
