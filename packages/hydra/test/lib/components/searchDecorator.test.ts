import { expect } from '@open-wc/testing'
import { dash, hydra, schema, sh } from '@tpluscode/rdf-ns-builders'
import { sinon, ex } from '@shaperone/testing'
import type { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import type { GraphPointer } from 'clownface'
import $rdf from '@shaperone/testing/env.js'
import type { BlankNode } from '@rdfjs/types'
import { rdfList } from '@tpluscode/rdfine/initializer'
import { testObjectState, testPropertyState } from '@shaperone/testing/models/form.js'
import type { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import * as instancesSelector from '../../../lib/components/instancesSelector.js'
import ResourceRepresentation from '../../helpers/alcaeus.js'
import { hydraCollectionProperty, hydraSearchProperty } from './_support.js'

describe('hydra/lib/components/searchDecorator', function () {
  describe('decorated', function () {
    let focusNode: GraphPointer<BlankNode>
    let decorated: InstancesSelectEditor
    let component: InstancesSelectEditor
    let value: PropertyObjectState<InstancesSelect>
    let property: PropertyState
    let updateComponentState: UpdateComponentState

    beforeEach(function () {
      value = testObjectState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
      property = testPropertyState($rdf.clownface({ dataset: $rdf.dataset() }).blankNode())
      focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode()
      $rdf.hydra.loadResource.reset()
      component = {
        editor: dash.InstancesSelectEditor,
        loadChoices: sinon.stub(),
        render: sinon.stub(),
        loadInstance: sinon.stub(),
        shouldLoad: sinon.stub(),
        sort: sinon.stub(),
      }
      decorated = instancesSelector.decorator.decorate(component, <any>$rdf)
      updateComponentState = sinon.spy()
    })

    describe('shouldLoad', function () {
      it('returns false if instances state is initialized and there is no search template', function () {
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

      it('returns true if instances state is not initialized', function () {
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

      it('returns true if expanded search URI has changed', function () {
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

      it('returns false if focus node does not provider variables required by hydra:search', function () {
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
          env: $rdf,
          focusNode,
          value,
          property,
          componentState: {},
          updateComponentState: sinon.stub(),
        } as any)

        // then
        expect(result).to.be.false
      })

      it('returns true if hydra:search is different than previous', function () {
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
          env: $rdf,
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

      it('returns false if sh:path does not find any focus nodes', function () {
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
          env: $rdf,
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

    describe('loadChoices', function () {
      it('sets loading state when API has returned collection', async function () {
        // given
        const property = hydraCollectionProperty()
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection), {
          member: [
            ex.Item1,
            ex.Item2,
            ex.Item3,
          ],
        })
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        const instances = await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
        } as any)

        // then
        expect(instances).to.have.length(3)
        for (const instance of instances) {
          expect(instance.value).to.match(/Item\d$/)
        }
      })

      it('dedupes simultaneous loading of same resource', async function () {
        // given
        const property = hydraCollectionProperty()
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
        } as any)
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledOnce
      })

      it('repeats resource call when previous load finished', async function () {
        // given
        const property = hydraCollectionProperty()
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
        } as any)
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledTwice
      })

      it('loads searchable collection when search template has been constructed', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
            template: 'http://example.com/foo{?bar}',
            mapping: [{
              variable: 'bar',
              property: ex.foo,
            }],
          })
        })
        focusNode.addOut(ex.foo, 'bar')
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledWith('http://example.com/foo?bar=bar')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/foo?bar=bar',
        })
      })

      it('constructs search URL from multiple nodes', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
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
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledWith('http://example.com/foo?bar=bar,baz')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/foo?bar=bar,baz',
        })
      })

      it('constructs search URL using sh:path before hydra:property', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
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
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {},
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledWith('http://example.com/?foo=foo&bar=baz')
        expect(updateComponentState).to.have.been.calledWith({
          lastLoaded: 'http://example.com/?foo=foo&bar=baz',
        })
      })

      it('does not load searchable collection when freetextQuery is empty string', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
            }],
          })
        })
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {
            freetextQuery: '',
          },
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).not.to.have.been.called
      })

      it('does not load searchable collection when freetextQuery is too short', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
              [sh.minLength.value]: 5,
            }],
          })
        })
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {
            freetextQuery: '1234',
          },
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).not.to.have.been.called
      })

      it('loads searchable collection when freetextQuery has exactly min length', async function () {
        // given
        property.shape.pointer.addOut(hydra.search, (template) => {
          $rdf.rdfine.hydra.IriTemplate(template, {
            template: 'http://example.com/foo{?q}',
            mapping: [{
              variable: 'q',
              property: hydra.freetextQuery,
              [sh.minLength.value]: 3,
            }],
          })
        })
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          env: $rdf,
          focusNode,
          property,
          componentState: {
            freetextQuery: 'abc',
          },
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).to.have.been.calledWith('http://example.com/foo?q=abc')
      })

      it('does not load if previous search was the same URI', async function () {
        // given
        const componentState = {
          searchUri: 'foo-bar',
          lastLoaded: 'foo-bar',
        }
        const collection = $rdf.rdfine.hydra.Collection($rdf.clownface({ dataset: $rdf.dataset(), graph: ex.Collection }).namedNode(ex.Collection))
        const representation = new ResourceRepresentation([collection.pointer])
        $rdf.hydra.loadResource.resolves({ representation })

        // when
        await decorated.loadChoices({
          focusNode,
          property,
          componentState,
          updateComponentState,
        } as any)

        // then
        expect($rdf.hydra.loadResource).not.to.have.been.called
        expect(updateComponentState).not.to.have.been.called
      })
    })
  })
})
