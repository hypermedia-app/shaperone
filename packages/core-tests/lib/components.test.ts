import { describe } from 'mocha'
import { sort } from '@hydrofoil/shaperone-core/lib/components.js'
import { fromPointer } from '@rdfine/shacl/lib/PropertyShape'
import { blankNode, namedNode } from '@shaperone/testing/nodeFactory.js'
import { expect } from 'chai'
import { ex } from '@shaperone/testing'
import { rdfs, schema, skos } from '@tpluscode/rdf-ns-builders'
import sh1 from '@hydrofoil/shaperone-core/ns.js'

describe('core/lib/components', () => {
  describe('sort', () => {
    it('sorts by rdf:label by default', () => {
      // given
      const shape = fromPointer(blankNode())
      const resources = [
        namedNode(ex.last).addOut(rdfs.label, 'Z'),
        namedNode(ex.first).addOut(rdfs.label, 'A'),
        namedNode(ex.second).addOut(rdfs.label, 'F'),
      ]

      // when
      const result = resources.sort(sort(shape))

      // then
      expect(result.map(r => r.term)).to.deep.equal([ex.first, ex.second, ex.last])
    })

    it('sorts by rdf:label when sh1:orderBy is not a list', () => {
      // given
      const shape = fromPointer(blankNode().addOut(sh1.orderBy, 'wrong'))
      const resources = [
        namedNode(ex.last).addOut(rdfs.label, 'Z'),
        namedNode(ex.first).addOut(rdfs.label, 'A'),
        namedNode(ex.second).addOut(rdfs.label, 'F'),
      ]

      // when
      const result = resources.sort(sort(shape))

      // then
      expect(result.map(r => r.term)).to.deep.equal([ex.first, ex.second, ex.last])
    })

    it('sorts by shape-annotated predicates', () => {
      // given
      const shape = fromPointer(blankNode().addList(sh1.orderBy, [schema.name]))
      const resources = [
        namedNode(ex.last).addOut(schema.name, 'foo'),
        namedNode(ex.first).addOut(schema.name, 'bar'),
        namedNode(ex.second).addOut(schema.name, 'baz'),
      ]

      // when
      const result = resources.sort(sort(shape))

      // then
      expect(result.map(r => r.term)).to.deep.equal([ex.first, ex.second, ex.last])
    })

    it('sorts by a sequence of shape-annotated predicates', () => {
      // given
      const shape = fromPointer(blankNode().addList(sh1.orderBy, [skos.prefLabel, skos.altLabel]))
      const resources = [
        namedNode(ex.last).addOut(skos.prefLabel, 'foo').addOut(skos.altLabel, 'foo'),
        namedNode(ex.first).addOut(skos.prefLabel, 'bar').addOut(skos.altLabel, 'bar'),
        namedNode(ex.second).addOut(skos.prefLabel, 'foo').addOut(skos.altLabel, 'baz'),
      ]

      // when
      const result = resources.sort(sort(shape))

      // then
      expect(result.map(r => r.term)).to.deep.equal([ex.first, ex.second, ex.last])
    })

    it('sorts by IRI when there are no predicates', () => {
      // given
      const shape = fromPointer(blankNode())
      const resources = [
        namedNode(ex.foo),
        namedNode(ex.bar),
        namedNode(ex.baz),
      ]

      // when
      const result = resources.sort(sort(shape))

      // then
      expect(result.map(r => r.term)).to.deep.equal([ex.bar, ex.baz, ex.foo])
    })
  })
})
