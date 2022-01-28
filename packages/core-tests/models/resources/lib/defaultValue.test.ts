import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { literal } from '@rdf-esm/data-model'
import { xsd, rdf, foaf, dash } from '@tpluscode/rdf-ns-builders'
import { NodeKindEnum } from '@rdfine/shacl'
import { defaultValue } from '@hydrofoil/shaperone-core/models/resources/lib/defaultValue'
import { propertyShape } from '@shaperone/testing/util'

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
      expect(pointer?.out(rdf.type).term).to.deep.eq(foaf.Agent)
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
      expect(pointer?.out(rdf.type).term).to.be.undefined
    })
  })
})
