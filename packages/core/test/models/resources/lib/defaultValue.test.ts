import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { literal } from '@rdf-esm/data-model'
import { xsd, sh, rdf, foaf, dash } from '@tpluscode/rdf-ns-builders'
import { NodeKindEnum } from '@rdfine/shacl'
import { defaultValue } from '../../../../models/resources/lib/defaultValue'
import { propertyShape } from '../../../util'

describe('core/models/resources/lib/defaultValue', () => {
  it('returns literal 0 for numeric values', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      [sh.datatype.value]: xsd.nonNegativeInteger,
    })

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer.term).to.deep.eq(literal('0', xsd.nonNegativeInteger))
  })

  it('returns empty string literal by default', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode())

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer.term).to.deep.eq(literal(''))
  })

  it('returns empty string literal with datatype', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      [sh.datatype.value]: xsd.anySimpleType,
    })

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer.term).to.deep.eq(literal('', xsd.anySimpleType))
  })

  it('returns default value from property', () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const property = propertyShape(graph.blankNode(), {
      defaultValue: literal('foo', xsd.anySimpleType),
    })

    // when
    const pointer = defaultValue(property, graph.blankNode())

    // then
    expect(pointer.term).to.deep.eq(literal('foo', xsd.anySimpleType))
  })

  const resourceNodeKinds = [
    NodeKindEnum.BlankNode,
    NodeKindEnum.BlankNodeOrIRI,
    NodeKindEnum.IRI,
  ]

  resourceNodeKinds.forEach((nodeKind) => {
    it(`adds sh:class as rdf:type to node kind ${nodeKind.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
      })

      // when
      const pointer = defaultValue(property, graph.blankNode())

      // then
      expect(pointer.out(rdf.type).term).to.deep.eq(foaf.Agent)
    })

    it(`does not add rdf:type when node kind is ${nodeKind.value} but editor is ${dash.InstancesSelectEditor.value}`, () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const property = propertyShape(graph.blankNode(), {
        nodeKind,
        class: foaf.Agent,
        [dash.editor.value]: dash.InstancesSelectEditor,
      })

      // when
      const pointer = defaultValue(property, graph.blankNode())

      // then
      expect(pointer.out(rdf.type).term).to.be.undefined
    })
  })
})
