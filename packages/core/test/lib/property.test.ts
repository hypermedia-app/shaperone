import { describe, it } from 'mocha'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { expect } from 'chai'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { sh, xsd } from '@tpluscode/rdf-ns-builders'
import { createTerm } from '../../lib/property'

describe('core/lib/property', () => {
  it('creates named node when property has sh:IRI kind', () => {
    // given
    const pointer = cf({ dataset: $rdf.dataset() }).blankNode()
    const property = {
      shape: new PropertyShapeMixin.Class(pointer, {
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
      shape: new PropertyShapeMixin.Class(pointer),
      datatype: xsd.int,
    }

    // when
    const term = createTerm(property, '41')

    // then
    expect(term).to.deep.equal($rdf.literal('41', xsd.int))
  })
})
