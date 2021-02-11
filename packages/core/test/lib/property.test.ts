import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { sh, xsd, schema } from '@tpluscode/rdf-ns-builders'
import { any, blankNode, namedNode } from '@shaperone/testing/nodeFactory'
import { ex as tbbt } from '@shaperone/testing'
import { createTerm, findNodes } from '../../lib/property'
import { propertyShape } from '../util'

describe('core/lib/property', () => {
  describe('createTerm', () => {
    it('creates named node when property has sh:IRI kind', () => {
    // given
      const pointer = cf({ dataset: $rdf.dataset() }).blankNode()
      const property = {
        shape: propertyShape(pointer, {
          [sh.nodeKind.value]: sh.IRI,
        }),
      }

      // when
      const term = createTerm(property, 'http://foo/bar')

      // then
      expect(term).to.deep.equal($rdf.namedNode('http://foo/bar'))
    })

    it('creates typed literal when property has sh:datatype', () => {
    // given
      const pointer = cf({ dataset: $rdf.dataset() }).blankNode()
      const property = {
        shape: propertyShape(pointer),
        datatype: xsd.int,
      }

      // when
      const term = createTerm(property, '41')

      // then
      expect(term).to.deep.equal($rdf.literal('41', xsd.int))
    })
  })

  describe('findNodes', () => {
    const graph = any()

    const sheldon = graph.namedNode(tbbt.Sheldon)
      .addOut(schema.knows, [tbbt.Penny, tbbt.Howard, tbbt.Amy, tbbt.Leonard])

    const penny = graph.namedNode(tbbt.Penny)

    const leonard = graph.namedNode(tbbt.Leonard)
      .addOut(schema.spouse, tbbt.Penny)
      .addOut(schema.knows, tbbt.Sheldon)

    it('follows direct path as named node', () => {
      // given
      const path = schema.knows

      // when
      const nodes = findNodes(sheldon, path)

      // then
      expect(nodes.terms).to.deep.contain.members([tbbt.Penny, tbbt.Howard, tbbt.Amy, tbbt.Leonard])
    })

    it('follows direct path as pointer', () => {
      // given
      const path = schema.knows

      // when
      const nodes = findNodes(sheldon, namedNode(path))

      // then
      expect(nodes.terms).to.deep.contain.members([tbbt.Penny, tbbt.Howard, tbbt.Amy, tbbt.Leonard])
    })

    it('follows simple inverse path', () => {
      // given
      const path = blankNode().addOut(sh.inversePath, schema.spouse)

      // when
      const nodes = findNodes(penny, path)

      // then
      expect(nodes.term).to.deep.eq(leonard.term)
    })

    it('follows simple alternative path', () => {
      // given
      const path = blankNode().addList(sh.alternativePath, [schema.spouse, schema.knows])

      // when
      const nodes = findNodes(leonard, path)

      // then
      expect(nodes.terms).to.deep.contain.members([tbbt.Penny, tbbt.Sheldon])
    })

    it('follows simple sequence path', () => {
      // given
      const [path] = blankNode().addList(sh.path, [schema.knows, schema.spouse]).out(sh.path).toArray()

      // when
      const nodes = findNodes(sheldon, path)

      // then
      expect(nodes.term).to.deep.eq(tbbt.Penny)
    })
  })
})
