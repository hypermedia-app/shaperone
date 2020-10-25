import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { NodeShapeMixin, PropertyShapeMixin } from '@rdfine/shacl'
import { schema, sh, dash } from '@tpluscode/rdf-ns-builders'
import { initialiseFocusNode, initialiseObjectState } from '../../../../models/forms/lib/stateBuilder'
import { loadMixins } from '../../../../index'

const ex = ns('http://example.com/')

describe('core/models/forms/lib/stateBuilder', () => {
  before(loadMixins)

  const shouldEnableEditorChoice = () => true

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
        multiEditors: [],
        shape: nestedShape,
        shapes: [otherShape],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.shapes).to.contain.ordered.members([nestedShape, otherShape])
    })

    it('does not reposition selected shape if it already got matched', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const nestedShape = new NodeShapeMixin.Class(graph.namedNode(ex.nestedNode))
      const otherShape = new NodeShapeMixin.Class(graph.namedNode(ex.otherNode))
      const getMatcher = () => () => true

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        multiEditors: [],
        shape: nestedShape,
        shapes: [otherShape, nestedShape],
        shouldEnableEditorChoice,
      }, undefined, { getMatcher })

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.matchingShapes).to.have.length(2)
      expect(state.matchingShapes).to.contain.ordered.members([otherShape, nestedShape])
    })

    it('does not reset selected editor of same object', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
        .addOut(ex.foo, 'bar')
      const shape = new NodeShapeMixin.Class(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const before = initialiseFocusNode({
        focusNode,
        editors: [],
        multiEditors: [],
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, undefined)
      before.properties[0].objects[0].selectedEditor = ex.FooEditor

      // when
      const after = initialiseFocusNode({
        focusNode,
        editors: [],
        multiEditors: [],
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, before)

      // then
      expect(after.properties[0].objects[0].selectedEditor).to.deep.eq(ex.FooEditor)
    })

    it('does not reset selected multi editor', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = new NodeShapeMixin.Class(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const params = {
        focusNode,
        editors: [],
        multiEditors: [],
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }
      const before = initialiseFocusNode(params, undefined)
      before.properties[0].selectedEditor = ex.FooMultiEditor

      // when
      const after = initialiseFocusNode(params, before)

      // then
      expect(after.properties[0].selectedEditor).to.deep.eq(ex.FooMultiEditor)
    })

    it('does not reset selection of single editors', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = new NodeShapeMixin.Class(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const params = {
        focusNode,
        editors: [],
        multiEditors: [{
          term: ex.FooMultiEditor,
          meta: {},
          match: () => 10,
        }],
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }
      const before = initialiseFocusNode(params, undefined)
      before.properties[0].selectedEditor = undefined

      // when
      const after = initialiseFocusNode(params, before)

      // then
      expect(after.properties[0].selectedEditor).to.be.undefined
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
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

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
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

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
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

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
        meta: {},
        match: () => 0,
      }

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [fooEditor],
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

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
        meta: {},
        match: () => 5,
      }
      const barEditor = {
        term: ex.BarEditor,
        meta: {},
        match: () => 10,
      }

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [fooEditor, barEditor],
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.properties[0].objects[0].editors).to.have.length(2)
      expect(state.properties[0].objects[0].editors[0].term).to.deep.equal(ex.FooEditor)
    })

    it('adds a value to property with sh:minCount > 0', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          minCount: 1,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties[0].objects[0]?.object.value).to.eq('')
    })

    it('when sh:minCount > 0 adds a triple if property has sh:default', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = new NodeShapeMixin.Class(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          minCount: 1,
          defaultValue: $rdf.literal('bar', 'en'),
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: [],
        multiEditors: [],
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties[0].objects[0]?.object.value).to.eq('bar')
      expect(focusNode.out(ex.foo).term).to.deep.eq($rdf.literal('bar', 'en'))
    })
  })

  describe('initialiseObjectState', () => {
    it('sets editorSwitchDisabled flag according to option', () => {
      // given
      const shapeGraph = cf({ dataset: $rdf.dataset() })
      const dataGraph = cf({ dataset: $rdf.dataset() }).literal(5)
      const shape = new PropertyShapeMixin.Class(shapeGraph.blankNode(), {
        path: ex.foo,
      })
      const context = {
        shape,
        editors: [],
        shouldEnableEditorChoice() {
          return false
        },
      }

      // when
      const state = initialiseObjectState(context, undefined)(dataGraph.literal(5))

      // then
      expect(state.editorSwitchDisabled).to.be.true
    })
  })
})
