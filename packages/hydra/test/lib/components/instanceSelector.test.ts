import { expect } from '@open-wc/testing'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import { sinon } from '@shaperone/testing'
import { propertyShape } from '@shaperone/testing/util.js'
import $rdf from '@shaperone/testing/env.js'
import type { NamedNode } from '@rdfjs/types'
import * as instancesSelector from '../../../lib/components/instancesSelector.js'
import { hydraCollectionProperty, hydraSearchProperty } from './_support.js'

describe('hydra/lib/components/instancesSelector', function () {
  describe('matcher', function () {
    let matcher: {
      term: NamedNode
      match: sinon.SinonStub
    }

    beforeEach(function () {
      matcher = {
        term: dash.InstancesSelectEditor,
        match: sinon.stub(),
      }
    })

    it('applies to Instances Selector', function () {
      expect(instancesSelector.matcher.term).to.deep.eq(dash.InstancesSelectEditor)
    })

    it('returns 1 if property shape has named node hydra:collection', function () {
      // given
      const property = hydraCollectionProperty()
      const value = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = instancesSelector.matcher.decorate(matcher)(property.shape, value)

      // then
      expect(result).to.eq(1)
    })

    it('returns 1 if property shape has hydra:search', function () {
      // given
      const property = hydraSearchProperty()
      const value = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = instancesSelector.matcher.decorate(matcher)(property.shape, value)

      // then
      expect(result).to.eq(1)
    })

    it('calls decorated matcher if hydra:collection is not named node', function () {
      // given
      const shape = propertyShape({
        [hydra.collection.value]: $rdf.blankNode(),
      })
      const value = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      instancesSelector.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })

    it('calls decorated matcher otherwise', function () {
      // given
      const shape = propertyShape()
      const value = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      instancesSelector.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })
  })
})
