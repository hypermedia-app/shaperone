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
import * as instancesSelector from '../../../lib/components/instancesSelector'

RdfResourceImpl.factory.addMixin(...Object.values(Hydra))

function hydraCollectionProperty() {
  return propertyShape({
    [hydra.collection.value]: ex.Collection,
  })
}

describe('lib/components/instancesSelector.ts', () => {
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
      const shape = hydraCollectionProperty()
      const value = clownface({ dataset: $rdf.dataset() }).blankNode()

      // when
      const result = instancesSelector.matcher.decorate(matcher)(shape, value)

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
    let updateComponentState: sinon.SinonStub
    let decorated: InstancesSelectEditor
    let component: InstancesSelectEditor
    let client: {
      loadResource: sinon.SinonStub
    }

    beforeEach(() => {
      focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
      updateComponentState = sinon.stub()
      client = {
        loadResource: sinon.stub(),
      }
      component = {
        editor: dash.InstancesSelectEditor,
        loadChoices: sinon.stub(),
        label: sinon.stub(),
        render: sinon.stub(),
      }
      decorated = instancesSelector.decorator(client).decorate(component)
    })

    describe('loadChoices', () => {
      it('does not call API when already loading', () => {
        // given
        const property = hydraCollectionProperty()

        // when
        decorated.loadChoices({
          focusNode,
          updateComponentState,
          property,
          componentState: {
            loading: true,
          },
        })

        // then
        expect(client.loadResource).not.to.have.been.called
      })

      it('sets loading state when calling the API', () => {
        // given
        const property = hydraCollectionProperty()

        // when
        decorated.loadChoices({
          focusNode,
          updateComponentState,
          property,
          componentState: {},
        })

        // then
        expect(updateComponentState).to.have.been.calledWith({
          loading: true,
        })
      })

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
        await decorated.loadChoices({
          focusNode,
          updateComponentState,
          property,
          componentState: {},
        })

        // then
        expect(updateComponentState).to.have.been.calledWith({
          loading: false,
          instances: sinon.match.array,
        })
        expect(updateComponentState.lastCall.lastArg.instances).to.have.length(3)
        for (const instance of updateComponentState.lastCall.lastArg.instances) {
          expect(instance.value).to.match(/Item\d$/)
        }
      })
    })
  })
})
