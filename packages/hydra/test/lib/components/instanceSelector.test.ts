import { expect } from '@open-wc/testing'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import { sinon, ex } from '@shaperone/testing'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { propertyShape } from '@hydrofoil/shaperone-core/test/util'
import clownface, { GraphPointer } from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { BlankNode, NamedNode } from 'rdf-js'
import { fromPointer } from '@rdfine/hydra/lib/Collection'
import RdfResourceImpl from '@tpluscode/rdfine'
import ResourceRepresentation from 'alcaeus/ResourceRepresentation'
import * as Hydra from '@rdfine/hydra'
import { testPropertyState } from '@hydrofoil/shaperone-core/test/models/forms/util'
import * as instancesSelector from '../../../lib/components/instancesSelector'

RdfResourceImpl.factory.addMixin(...Object.values(Hydra))

function hydraCollectionProperty() {
  const property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())

  property.shape = propertyShape({
    [hydra.collection.value]: ex.Collection,
  })

  return property
}

describe('hydra/lib/components/instancesSelector', () => {
  describe('matcher', () => {
    let matcher: {
      term: NamedNode
      match: sinon.SinonStub
    }

    beforeEach(() => {
      matcher = {
        term: dash.InstancesSelectEditor,
        match: sinon.stub(),
      }
    })

    it('applies to Instances Selector', () => {
      expect(instancesSelector.matcher.term).to.deep.eq(dash.InstancesSelectEditor)
    })

    it('returns 1 if property shape has named node hydra:collection', () => {
      // given
      const property = hydraCollectionProperty()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = instancesSelector.matcher.decorate(matcher)(property.shape, value)

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
      instancesSelector.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })

    it('calls decorated matcher otherwise', () => {
      // given
      const shape = propertyShape()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      instancesSelector.matcher.decorate(matcher)(shape, value)

      // then
      expect(matcher.match).to.have.been.called
    })
  })

  describe('decorated', () => {
    let focusNode: GraphPointer<BlankNode>
    let decorated: InstancesSelectEditor
    let component: InstancesSelectEditor
    let client: {
      loadResource: sinon.SinonStub
    }

    beforeEach(() => {
      focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
      client = {
        loadResource: sinon.stub(),
      }
      component = {
        editor: dash.InstancesSelectEditor,
        loadChoices: sinon.stub(),
        label: sinon.stub(),
        render: sinon.stub(),
        loadInstance: sinon.stub(),
        shouldLoad: sinon.stub(),
      }
      decorated = instancesSelector.decorator(client).decorate(component)
    })

    describe('loadChoices', () => {
      it('sets loading state when API has returned collection', async () => {
        // given
        const property = hydraCollectionProperty()
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection), {
          member: [
            ex.Item1,
            ex.Item2,
            ex.Item3,
          ],
        })
        const representation = new ResourceRepresentation(collection.pointer, RdfResourceImpl.factory, ex.Collection)
        client.loadResource.resolves({ representation })

        // when
        const instances = await decorated.loadChoices({
          focusNode,
          property,
        } as any)

        // then
        expect(instances).to.have.length(3)
        for (const instance of instances) {
          expect(instance.value).to.match(/Item\d$/)
        }
      })
    })
  })
})
