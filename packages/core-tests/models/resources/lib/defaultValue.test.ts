import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { literal } from '@rdf-esm/data-model'
import { xsd, rdf, foaf, dash, sh } from '@tpluscode/rdf-ns-builders'
import { NodeKind, NodeKindEnum } from '@rdfine/shacl'
import { defaultValue } from '@hydrofoil/shaperone-core/models/resources/lib/defaultValue.js'
import { propertyShape } from '@shaperone/testing/util.js'
import { Term } from 'rdf-js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'

describe('core/models/resources/lib/defaultValue', () => {
  it('returns default value from property', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      defaultValue: literal('foo', xsd.anySimpleType),
    })

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer?.term).to.deep.eq(literal('foo', xsd.anySimpleType))
  })

  it('returns null when there is no nodeKind', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
    })

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer).to.be.null
  })

  it('creates a random IRI when sh:nodeKind sh:IRI', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
    })

    // when
    const first = defaultValue(property, graph.blankNode())
    const second = defaultValue(property, graph.blankNode())

    // then
    expect(first?.term).not.to.deep.eq(second)
  })

  it('uses base from dash:uriStart when sh:nodeKind sh:IRI', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRI,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })

    // when
    const term = defaultValue(property, graph.blankNode())?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  it('creates a URI node when node kind is sh:BlankNodeOrIRI and property has dash:uriStart', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.BlankNodeOrIRI,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })

    // when
    const term = defaultValue(property, graph.blankNode())?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  it('creates a URI node when node kind is sh:IRIOrLiteral and property has dash:uriStart', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      nodeKind: sh.IRIOrLiteral,
      [sh1.iriPrefix.value]: 'http://example.com/foo/',
    })

    // when
    const term = defaultValue(property, graph.blankNode())?.term

    // then
    expect(term?.termType).to.eq('NamedNode')
    expect(term?.value).to.match(/^http:\/\/example.com\/foo\/.+$/)
  })

  const resourceNodeKinds: [NodeKind, Term['termType']][] = [
    [NodeKindEnum.BlankNode, 'BlankNode'],
    [NodeKindEnum.BlankNodeOrIRI, 'BlankNode'],
    [NodeKindEnum.BlankNodeOrLiteral, 'BlankNode'],
    [NodeKindEnum.IRI, 'NamedNode'],
  ]

  resourceNodeKinds.forEach(([nodeKind, termType]) => {
    it(`creates a node of type ${termType} when nodeKind is ${nodeKind.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
      })

      // when
      const pointer = defaultValue(property, graph.blankNode())

      // then
      expect(pointer?.term?.termType).to.eq(termType)
    })

    it(`adds sh:class as rdf:type to node kind ${nodeKind.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
        [sh1.iriPrefix.value]: 'http://example.com/foo/',
      })

      // when
      const pointer = defaultValue(property, graph.blankNode())

      // then
      expect(pointer?.out(rdf.type).term).to.deep.eq(foaf.Agent)
    })

    it(`does not add rdf:type when node kind is ${nodeKind.value} but editor is ${dash.InstancesSelectEditor.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
        [dash.editor.value]: dash.InstancesSelectEditor,
        [sh1.iriPrefix.value]: 'http://example.com/foo/',
      })

      // when
      const pointer = defaultValue(property, graph.blankNode())

      // then
      expect(pointer?.out(rdf.type).term).to.be.undefined
    })
  })
})
