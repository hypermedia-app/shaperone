import { expect } from 'chai'
import { schema, sh, skos } from '@tpluscode/rdf-ns-builders'
import { NamedNode, BlankNode } from 'rdf-js'
import { any, blankNode, namedNode } from '@shaperone/testing/nodeFactory'
import { ex as tbbt } from '@shaperone/testing'
import type { GraphPointer } from 'clownface'
import { literal } from '@rdf-esm/data-model'
import { findNodes } from '../index'

describe('clownface-shacl-path', () => {
  describe('findNodes', () => {
    const graph = any()

    const sheldon = graph.namedNode(tbbt.Sheldon)
      .addOut(schema.knows, [tbbt.Penny, tbbt.Howard, tbbt.Amy, tbbt.Leonard])
      .addOut(schema.spouse, tbbt.Amy)

    const amy = graph.namedNode(tbbt.Amy)
      .addOut(schema.knows, tbbt.Leonard)
      .addOut(skos.prefLabel, 'Amy')
      .addOut(skos.altLabel, 'Amy Farrah-Fowler')

    const penny = graph.namedNode(tbbt.Penny)

    const leonard = graph.namedNode(tbbt.Leonard)
      .addOut(schema.spouse, tbbt.Penny)
      .addOut(schema.knows, [tbbt.Sheldon, tbbt.Amy])

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

    it('follows sequence path of two inverse paths', () => {
      // given
      /*
       sh:path (
         [ sh:inversePath schema:spouse ] # Leonard is Penny's spouse
         [ sh:inversePath schema:knows ]  # Sheldon and Amy know Leonard
       )
       */
      const root = blankNode()
      root.addList(sh.path, [
        root.blankNode().addOut(sh.inversePath, schema.spouse),
        root.blankNode().addOut(sh.inversePath, schema.knows),
      ])
      const [path] = root.out(sh.path).toArray()

      // when
      const nodes = findNodes(penny, path)

      // then
      expect(nodes.terms).to.deep.contain.members([tbbt.Sheldon, tbbt.Amy])
    })

    it('follows sequence path of predicate paths followed by alternative path', () => {
      // given
      /*
       sh:path (
         schema:knows # Leonard knows Sheldon (among others)
         schema:spouse # Amy is Sheldon's spouse
         [ sh:alternativePath ( skos:prefLabel skos:altLabel ) ] # Amy has two labels
       )
       */
      const root = blankNode()
      root.addList<NamedNode | BlankNode>(sh.path, [
        schema.knows,
        schema.spouse,
        root.blankNode().addList(sh.alternativePath, [skos.prefLabel, skos.altLabel]),
      ])
      const [path] = root.out(sh.path).toArray()

      // when
      const nodes = findNodes(leonard, path)

      // then
      expect(nodes.terms).to.deep.contain.members([literal('Amy'), literal('Amy Farrah-Fowler')])
    })

    it('follows an alternative of two inverse paths', () => {
      // given
      /*
       sh:path [
         sh:alternativePath ( # find both
           [ sh:inversePath schema:spouse ] # Sheldon, who is Amy's spouse
           [ sh:inversePath schema:knows ] # Leonard, who knows Amy
         )
       ]
       */
      const path = blankNode()
      path.addList(sh.alternativePath, [
        path.blankNode().addOut(sh.inversePath, schema.spouse),
        path.blankNode().addOut(sh.inversePath, schema.knows),
      ])

      // when
      const nodes = findNodes(amy, path)

      // then
      expect(nodes.terms).to.deep.contain.members([tbbt.Sheldon, tbbt.Leonard])
    })

    describe('throws when path is not supported', () => {
      const unsupportedPaths: [string, GraphPointer][] = [
        ['sh:alternativePath not a list', blankNode().addOut(sh.alternativePath)],
        ['path is sh:zeroOrMorePath', blankNode().addOut(sh.zeroOrMorePath)],
        ['path is sh:oneOrMorePath', blankNode().addOut(sh.oneOrMorePath)],
        ['path is not any SHACL Property Path', blankNode()],
      ]

      for (const [title, path] of unsupportedPaths) {
        it(title, () => {
          expect(() => findNodes(blankNode(), path)).to.throw(Error)
        })
      }
    })
  })
})
