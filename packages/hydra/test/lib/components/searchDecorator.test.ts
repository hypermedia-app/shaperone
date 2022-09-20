import { expect } from '@open-wc/testing'
import { dash, hydra, schema, sh } from '@tpluscode/rdf-ns-builders'
import { sinon, ex } from '@shaperone/testing'
import type { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import clownface, { GraphPointer } from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { BlankNode } from 'rdf-js'
import { fromPointer } from '@rdfine/hydra/lib/Collection'
import RdfResourceImpl from '@tpluscode/rdfine'
import { rdfList } from '@tpluscode/rdfine/initializer'
import * as Hydra from '@rdfine/hydra'
import { testObjectState, testPropertyState } from '@shaperone/testing/models/form'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { fromPointer as initTemplate } from '@rdfine/hydra/lib/IriTemplate'
import { UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import * as instancesSelector from '../../../lib/components/instancesSelector'
import { ResourceRepresentation } from '../../helpers/alcaeus'
import { hydraCollectionProperty, hydraSearchProperty } from './_support'

RdfResourceImpl.factory.addMixin(...Object.values(Hydra))

describe('hydra/lib/components/searchDecorator', () => {
  describe('decorated', () => {
    let focusNode: GraphPointer<BlankNode>
    let decorated: InstancesSelectEditor
    let component: InstancesSelectEditor
    let client: {
      loadResource: sinon.SinonStub
    }
    let value: PropertyObjectState<InstancesSelect>
    let property: PropertyState
    let updateComponentState: UpdateComponentState

    beforeEach(() => {
      value = testObjectState(clownface({ dataset: $rdf.dataset() }).blankNode())
      property = testPropertyState(clownface({ dataset: $rdf.dataset() }).blankNode())
      focusNode = clownface({ dataset: $rdf.dataset() }).blankNode()
      client = {
        loadResource: sinon.stub(),
      }
      component = {
        editor: dash.InstancesSelectEditor,
        loadChoices: sinon.stub(),
        render: sinon.stub(),
        loadInstance: sinon.stub(),
        shouldLoad: sinon.stub(),
        sort: sinon.stub(),
      }
      decorated = instancesSelector.decorator(client).decorate(component)
      updateComponentState = sinon.spy()
    })

    describe('shouldLoad', () => {
      it('returns false if instances state is initialized and there is no search template', () => {
        // given
        const componentState = { instances: [] }

        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState,
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.false
      })

      it('returns true if instances state is not initialized', () => {
        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState: {},
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.true
      })

      it('returns true if expanded search URI has changed', () => {
        // given
        value.componentState.searchUri = 'foo'

        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState: {},
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.true
      })

      it('returns false if focus node does not provider variables required by hydra:search', () => {
        // given
        property = hydraSearchProperty({
          search: {
            template: 'people?name={name}',
            mapping: {
              variable: 'name',
              property: schema.name,
              required: true,
            },
          },
        })

        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState: {},
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.false
      })

      it('returns true if hydra:search is different than previous', () => {
        // given
        property = hydraSearchProperty({
          search: {
            template: 'people?name={name}',
            mapping: {
              variable: 'name',
              property: schema.name,
              required: true,
            },
          },
        })
        focusNode.addOut(schema.name, 'john')

        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState: {
            searchUri: 'people?name=jane',
          },
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.true
      })

      it('returns false if sh:path does not find any focus nodes', () => {
        // given
        property = hydraSearchProperty({
          search: {
            template: 'people?name={name}',
            [sh.path.value]: ex.foo,
            mapping: {
              variable: 'name',
              property: schema.name,
            },
          },
        })
        const componentState = { instances: [] }

        // when
        const result = decorated.shouldLoad({
          focusNode,
          value,
          property,
          componentState,
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.false
      })
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
        const representation = new ResourceRepresentation([collection.pointer])
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

      it('dedupes simultaneous loading of same resource', async () => {
        // given
        const property = hydraCollectionProperty()
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        decorated.loadChoices({
          focusNode,
          property,
        } as any)
        await decorated.loadChoices({
          focusNode,
          property,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledOnce
      })

      it('repeats resource call when previous load finished', async () => {
        // given
        const property = hydraCollectionProperty()
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
        } as any)
        await decorated.loadChoices({
          focusNode,
          property,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledTwice
      })

      it('loads searchable collection when search template has been constructed', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/foo{?bar}',
            mapping: [{
              variable: 'bar',
              property: ex.foo,
            }],
          })
        })
        focusNode.addOut(ex.foo, 'bar')
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledWith('http://example.com/foo?bar=bar')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/foo?bar=bar',
        })
      })

      it('constructs search URL from multiple nodes', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/foo{?bar}',
            [sh.path.value]: ex.child,
            mapping: [{
              variable: 'bar',
              property: ex.foo,
            }],
          })
        })
        focusNode.addOut(ex.child, child => child.addOut(ex.foo, 'bar'))
        focusNode.addOut(ex.child, child => child.addOut(ex.foo, 'baz'))
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledWith('http://example.com/foo?bar=bar,baz')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/foo?bar=bar,baz',
        })
      })

      it('constructs search URL using sh:path before hydra:property', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/{?foo,bar}',
            [sh.path.value]: ex.child,
            mapping: [{
              variable: 'foo',
              property: ex.foo,
            }, {
              variable: 'bar',
              property: ex.bar,
              [sh.path.value]: rdfList(ex.baz, ex.baz),
            }],
          })
        })
        focusNode.addOut(ex.child, (child) => {
          child.addOut(ex.foo, 'foo')
          child.addOut(ex.bar, 'bar')
          child.addOut(ex.baz, bar => bar.addOut(ex.baz, 'baz'))
        })
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledWith('http://example.com/?foo=foo&bar=baz')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/?foo=foo&bar=baz',
        })
      })

      it('does not load searchable collection when freetextQuery is empty string', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
            }],
          })
        })
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {
            freetextQuery: '',
          },
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).not.to.have.been.called
      })

      it('does not load searchable collection when freetextQuery is too short', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
              [sh.minLength.value]: 5,
            }],
          })
        })
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {
            freetextQuery: '1234',
          },
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).not.to.have.been.called
      })

      it('loads searchable collection when freetextQuery has exactly min length', async () => {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          initTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
              [sh.minLength.value]: 3,
            }],
          })
        })
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState: {
            freetextQuery: 'abc',
          },
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).to.have.been.calledWith('http://example.com/foo?q=abc')
      })

      it('does not load if previous search was the same URI', async () => {
        // given
        const componentState = {
          searchUri: 'foo-bar',
          lastLoaded: 'foo-bar',
        }
        const collection = fromPointer(clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        client.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState,
          updateComponentState,
        } as any)

        // then
        expect(client.loadResource).not.to.have.been.called
        expect(updateComponentState).not.to.have.been.called
      })
    })
  })
})
