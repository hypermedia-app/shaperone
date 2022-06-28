import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdf-esm/namespace'
import { fromPointer } from '@rdfine/shacl/lib/NodeShape'
import { sh, dash, dcterms } from '@tpluscode/rdf-ns-builders'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { testEditor, testStore } from '@shaperone/testing/models/form'
import {
  initialiseFocusNode,
  initialiseObjectState,
  initialisePropertyShape,
} from '@hydrofoil/shaperone-core/models/forms/lib/stateBuilder'
import { loadMixins } from '@hydrofoil/shaperone-core'
import { Store } from '@hydrofoil/shaperone-core/state'
import { propertyShape } from '@shaperone/testing/util'
import { blankNode } from '@shaperone/testing/nodeFactory'

const ex = ns('http://example.com/')

describe('@hydrofoil/shaperone-core/models/forms/lib/stateBuilder', () => {
  let store: Store

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
        components: store.getState().components,
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
        components: store.getState().components,
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
        components: store.getState().components,
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
        components: store.getState().components,
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
        components: store.getState().components,
        shouldEnableEditorChoice,
      }, undefined)
      before.properties[0].objects[0].selectedEditor = ex.FooEditor

      // when
      const after = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        shape,
        shapes: [shape],
        components: store.getState().components,
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
        components: store.getState().components,
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
        score: 10,
      }]
      const params = {
        focusNode,
        editors,
        components: store.getState().components,
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
        components: store.getState().components,
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
        components: store.getState().components,
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
        meta: blankNode(),
        match: () => 5,
        score: 5,
      }, {
        term: ex.BarEditor,
        meta: blankNode(),
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
        components: store.getState().components,
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
        components: store.getState().components,
      }, undefined)

      // then
      expect(state.properties[0].objects.length).to.eq(2)
    })

    it('combines all property shapes from logical constraints', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Person)
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: dcterms.identifier,
          types: [sh.PropertyShape],
        }],
        or: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }, {
          types: [sh.NodeShape],
          property: {
            path: ex.givenName,
            types: [sh.PropertyShape],
          },
        }],
        and: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }],
        xone: [{
          types: [sh.NodeShape],
          property: {
            path: ex.lastName,
            types: [sh.PropertyShape],
          },
        }, {
          types: [sh.NodeShape],
          property: {
            path: ex.familyName,
            types: [sh.PropertyShape],
          },
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties).to.have.length(6)
    })

    it('adds logical constraint groups to focus node state', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Person)
      const shape = fromPointer(graph.blankNode(), {
        or: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }],
        and: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }],
        xone: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.logicalConstraints.or).to.have.length(1)
      expect(state.logicalConstraints.and).to.have.length(1)
      expect(state.logicalConstraints.xone).to.have.length(1)
    })

    it('provides pointers to logical constraints a property may be part of', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Person)
      const shape = fromPointer(graph.blankNode(), {
        or: [{
          types: [sh.NodeShape],
          property: {
            path: ex.firstName,
            types: [sh.PropertyShape],
          },
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      const logicalConstraint = state.logicalConstraints.or[0]
      expect(logicalConstraint.term.term).to.deep.equal(shape.pointer.out(sh.or).term)
      expect(logicalConstraint.component).to.deep.equal(sh.OrConstraintComponent)
    })

    it('combines all property shapes from logical constraints, defined without wrapping node shape', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Person)
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: dcterms.identifier,
          types: [sh.PropertyShape],
        }],
        or: [{
          path: ex.firstName,
          types: [sh.PropertyShape],
        }, {
          path: ex.givenName,
          types: [sh.PropertyShape],
        }],
        and: [{
          path: ex.firstName,
          types: [sh.PropertyShape],
        }],
        xone: [{
          path: ex.lastName,
          types: [sh.PropertyShape],
        }, {
          path: ex.familyName,
          types: [sh.PropertyShape],
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties).to.have.length(6)
    })

    it('sets hidden state to false by default', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties[0].hidden).to.be.false
    })

    it('sets hidden state when property is dash:hidden', () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const focusNode = graph.node(ex.Foo)
      const shape = fromPointer(graph.blankNode(), {
        property: [{
          path: ex.foo,
          types: [sh.PropertyShape],
          hidden: true,
        }],
      })

      // when
      const state = initialiseFocusNode({
        focusNode,
        editors: store.getState().editors,
        components: store.getState().components,
        shape,
        shapes: [],
        shouldEnableEditorChoice: () => true,
      }, undefined)

      // then
      expect(state.properties[0].hidden).to.be.true
    })
  })

  describe('initialisePropertyShape', () => {
    it('selects lower-score multi-editor if it is the best match with available component', () => {
      // given
      const shapeGraph = cf({ dataset: $rdf.dataset() })
      const focusNode = cf({ dataset: $rdf.dataset() }).blankNode()
      const shape = propertyShape(shapeGraph.blankNode(), {
        path: ex.foo,
      })
      const { components, editors } = store.getState()
      components.components[ex.lowerMatch.value] = {
        editor: ex.lowerMatch,
        loading: false,
      }
      editors.matchMultiEditors = () => [
        { term: ex.higherMatch, score: 20 },
        { term: ex.lowerMatch, score: 4 },
      ]
      const context = {
        focusNode,
        shape,
        editors,
        components,
        shouldEnableEditorChoice: () => true,
      }

      // when
      const state = initialisePropertyShape(context, undefined)

      // then
      expect(state.selectedEditor).to.deep.eq(ex.lowerMatch)
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
        components: store.getState().components,
        shouldEnableEditorChoice() {
          return false
        },
      }

      // when
      const state = initialiseObjectState(context, undefined)(dataGraph.literal(5))

      // then
      expect(state.editorSwitchDisabled).to.be.true
    })

    it('selects lower-score editor if it is the best match with available component', () => {
      // given
      const shapeGraph = cf({ dataset: $rdf.dataset() })
      const dataGraph = cf({ dataset: $rdf.dataset() }).literal(5)
      const shape = propertyShape(shapeGraph.blankNode(), {
        path: ex.foo,
      })
      const { components, editors } = store.getState()
      components.components[ex.lowerMatch.value] = {
        editor: ex.lowerMatch,
        loading: false,
      }
      editors.matchSingleEditors = () => [
        { term: ex.higherMatch, score: 10 },
        { term: ex.lowerMatch, score: 5 },
      ]
      const context = {
        shape,
        editors,
        components,
        shouldEnableEditorChoice: () => true,
      }

      // when
      const state = initialiseObjectState(context, undefined)(dataGraph.literal(5))

      // then
      expect(state.selectedEditor).to.deep.eq(ex.lowerMatch)
    })
  })
})
