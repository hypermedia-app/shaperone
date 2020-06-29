import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import ns from '@rdfjs/namespace'
import { NodeShapeMixin } from '@rdfine/shacl'
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
  })
})
