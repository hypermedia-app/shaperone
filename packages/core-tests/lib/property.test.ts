import { describe, it } from 'mocha'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from '@rdf-esm/data-model'
import { dataset } from '@rdf-esm/dataset'
import { sh, xsd } from '@tpluscode/rdf-ns-builders'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import { propertyShape } from '@shaperone/testing/util.js'

describe('core/lib/property', () => {
  describe('createTerm', () => {
    it('creates named node when property has sh:IRI kind', () => {
    // given
      const pointer = cf({ dataset: dataset() }).blankNode()
      const property = {
        shape: propertyShape(pointer, {
          [sh.nodeKind.value]: sh.IRI,
        }),
      }

      // when
      const term = createTerm(property, 'http://foo/bar')

      // then
      expect(term.value).to.equal('http://foo/bar')
    })

    it('creates typed literal when property has sh:datatype', () => {
    // given
      const pointer = cf({ dataset: dataset() }).blankNode()
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
})
