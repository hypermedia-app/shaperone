import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import { schema, sh, dash } from '@tpluscode/rdf-ns-builders'
import { testEditor, testStore } from '@shaperone/testing/models/form'
import { initialiseFocusNode, initialiseObjectState } from '../../../../models/forms/lib/stateBuilder'
import { loadMixins } from '../../../../index'
import { Store } from '../../../../state'
import { propertyShape } from '../../../util'

const ex = ns('http://example.com/')

describe('core/models/forms/lib/stateBuilder', () => {
  let store: Store
  const meta = {} as any

  before(loadMixins)
  beforeEach(() => {
    ({ store } = testStore())
  })

  const shouldEnableEditorChoice = () => true

  describe('initialiseFocusNode', () => {
    it('positions explicitly selected shape at the head of shapes array', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const nestedShape = fromPointer(graph.namedNode(ex.nestedNode))
      const otherShape = fromPointer(graph.namedNode(ex.otherNode))

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape: nestedShape,
        shapes: [otherShape],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.shapes).to.contain.ordered.members([nestedShape, otherShape])
    })

    it('does not reposition selected shape in shapes array', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const nestedShape = fromPointer(graph.namedNode(ex.nestedNode))
      const otherShape = fromPointer(graph.namedNode(ex.otherNode))

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape: nestedShape,
        shapes: [otherShape, nestedShape],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.shapes).to.have.length(2)
      expect(state.shapes.map(s => s.id)).to.contain.ordered.members([otherShape.id, nestedShape.id])
    })

    it('does not reset selected editor of same object if it still matches', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
        .addOut(ex.foo, 'bar')
      const shape = fromPointer(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const { editors } = store.getState()
      const before = initialiseFocusNode({
        focusNode,
        editors,
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, undefined)
      before.properties[0].objects[0].selectedEditor = ex.FooEditor
      editors.matchSingleEditors = () => [{
        ...testEditor(ex.FooEditor),
        score: 10,
        meta: <any> {},
      }]

      // when
      const after = initialiseFocusNode({
        focusNode,
        editors,
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, before)

      // then
      expect(after.properties[0].objects[0].selectedEditor).to.deep.eq(ex.FooEditor)
    })

    it('resets selected editor if it no longer matches', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
        .addOut(ex.foo, 'bar')
      const shape = fromPointer(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const before = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, undefined)
      before.properties[0].objects[0].selectedEditor = ex.FooEditor

      // when
      const after = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape,
        shapes: [shape],
        shouldEnableEditorChoice,
      }, before)

      // then
      expect(after.properties[0].objects[0].selectedEditor).to.be.undefined
    })

    it('does not reset selected multi editor', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = fromPointer(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const params = {
        focusNode,
        editors: store.getState().editors,
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
      const shape = fromPointer(graph.namedNode(ex.shape), {
        property: [{
          types: [sh.PropertyShape],
          name: 'foo',
          path: ex.foo,
        }],
      })
      const { editors } = store.getState()
      editors.matchMultiEditors = () => [{
        term: ex.FooMultiEditor,
        match: () => 10,
        meta,
      }]
      const params = {
        focusNode,
        editors,
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
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: schema.age,
          types: [sh.PropertyShape],
          [sh.minCount.value]: 1,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
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
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: schema.age,
          types: [sh.PropertyShape],
          [sh.minCount.value]: 2,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.properties[0].canRemove).to.be.false
    })

    it('does not add the preferred editor second time', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo).addOut(ex.foo, 'bar')
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          [dash.editor.value]: ex.FooEditor,
        }],
      })
      const { editors } = store.getState()
      editors.matchSingleEditors = () => [{
        term: ex.FooEditor,
        meta: {},
        match: () => 5,
        score: 5,
      }, {
        term: ex.BarEditor,
        meta: {},
        match: () => 10,
        score: 10,
      }]

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors,
        shape,
        shapes: [],
        shouldEnableEditorChoice,
      }, undefined)

      // then
      expect(state.properties[0].objects[0].editors).to.have.length(2)
      expect(state.properties[0].objects[0].editors[0].term).to.deep.equal(ex.FooEditor)
    })

    it('adds a object states to property with sh:minCount > 0', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          minCount: 2,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties[0].objects.length).to.eq(2)
    })
  })

  describe('initialiseObjectState', () => {
    it('sets editorSwitchDisabled flag according to option', () => {
      // given
      const shapeGraph = cf({ dataset: $rdf.dataset() })
      const dataGraph = cf({ dataset: $rdf.dataset() }).literal(5)
      const shape = propertyShape(shapeGraph.blankNode(), {
        path: ex.foo,
      })
      const context = {
        shape,
        editors: store.getState().editors,
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
