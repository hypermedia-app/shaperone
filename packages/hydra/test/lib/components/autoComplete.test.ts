import { expect } from '@open-wc/testing'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import { sinon } from '@shaperone/testing'
import { propertyShape } from '@shaperone/testing/util'
import clownface from 'clownface'
import $rdf from '@rdfjs/dataset'
import { NamedNode } from 'rdf-js'
import * as autoComplete from '../../../lib/components/autocomplete'
import { hydraCollectionProperty, hydraSearchProperty } from './_support'

describe('hydra/lib/components/autoComplete', () => {
  describe('matcher', () => {
    let matcher: {
      term: NamedNode
      match: sinon.SinonStub
    }

    beforeEach(() => {
      matcher = {
        term: dash.AutoCompleteEditor,
        match: sinon.stub(),
      }
    })

    it('applies to Auto Complete', () => {
      expect(matcher.term).to.deep.eq(dash.AutoCompleteEditor)
    })

    it('returns 1 if property shape has named node hydra:collection', () => {
      // given
      const property = hydraCollectionProperty()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = autoComplete.matcher.decorate(matcher)(property.shape, value)

      // then
      expect(result).to.eq(1)
    })

    it('returns 1 if property shape has hydra:search', () => {
      // given
      const property = hydraSearchProperty()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = autoComplete.matcher.decorate(matcher)(property.shape, value)

      // then
      expect(result).to.eq(1)
    })

    it('calls decorated matcher if hydra:collection is not named node', () => {
      // given
      const shape = propertyShape({
        [hydra.collection.value]: $rdf.blankNode(),
      })
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      autoComplete.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })

    it('calls decorated matcher otherwise', () => {
      // given
      const shape = propertyShape()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      autoComplete.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })
  })
})
