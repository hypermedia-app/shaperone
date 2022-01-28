import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { AnyPointer } from 'clownface'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form'
import { Term } from 'rdf-js'
import createFocusNodeState from '@hydrofoil/shaperone-core/models/resources/effects/forms/createFocusNodeState'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { propertyShape } from '@shaperone/testing/util'

describe('models/resources/effects/forms/createFocusNodeState', () => {
  let store: Store
  let graph: AnyPointer
  let form: symbol
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
  }

  beforeEach(() => {
    ({ form, store } = testStore())
    formState = store.getState().forms.get(form)!;
    ({ graph } = store.getState().resources.get(form)!)
  })

  it('ensures defaultValue added to graph and object without default', () => {
    // given
    const focusNode = graph.blankNode()
    const property = propertyShape({
      path: schema.name,
      defaultValue: $rdf.literal('default name'),
    })
    const object = {}
    formState.focusNodes = {
      [focusNode.value]: {
        properties: [{
          shape: property,
          objects: [object],
        }],
      },
    }

    // when
    createFocusNodeState(store)({
      form,
      focusNode,
    })

    // then
    expect(focusNode.out(schema.name).term).to.deep.eq($rdf.literal('default name'))
    expect(store.getDispatch().forms.setObjectValue).to.have.been.called
  })

  it('only populates first object state without value if it is the same dafault', () => {
    // given
    const focusNode = graph.blankNode()
    const property = propertyShape({
      path: schema.name,
      defaultValue: $rdf.literal('default name'),
    })
    formState.focusNodes = {
      [focusNode.value]: {
        properties: [{
          shape: property,
          objects: [{}, {}, {}],
        }],
      },
    }

    // when
    createFocusNodeState(store)({
      form,
      focusNode,
    })

    // then
    expect(store.getDispatch().forms.setObjectValue).to.have.been.calledOnce
  })

  it('does nothing if default value is already amongst objects', () => {
    // given
    const focusNode = graph.blankNode().addOut(schema.name, 'default name')
    const property = propertyShape({
      path: schema.name,
      defaultValue: $rdf.literal('default name'),
    })
    formState.focusNodes = {
      [focusNode.value]: {
        properties: [{
          shape: property,
          objects: [{}],
        }],
      },
    }

    // when
    createFocusNodeState(store)({
      form,
      focusNode,
    })

    // then
    expect(store.getDispatch().forms.setObjectValue).not.to.have.been.called
  })

  describe('when property has sh:class', () => {
    it('adds rdf:type to blank node children', () => {
      // given
      const focusNode = graph.blankNode()
        .addOut(schema.knows, null)
        .addOut(schema.knows, null)
      const property = propertyShape({
        path: schema.knows,
        class: schema.Person,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: focusNode.out(schema.knows).map(object => ({
              object,
            })),
          }],
        },
      }

      // when
      createFocusNodeState(store)({
        form,
        focusNode,
      })

      // then
      expect(focusNode.out(schema.knows).out(rdf.type).terms)
        .containAll<Term>(type => type.equals(schema.Person))
    })
    it('does not add rdf:type to named node children', () => {
      // given
      const focusNode = graph.blankNode()
        .addOut(schema.knows, graph.namedNode('foo'))
        .addOut(schema.knows, graph.namedNode('bar'))
      const property = propertyShape({
        path: schema.knows,
        class: schema.Person,
      })
      formState.focusNodes = {
        [focusNode.value]: {
          properties: [{
            shape: property,
            objects: focusNode.out(schema.knows).map(object => ({
              object,
            })),
          }],
        },
      }

      // when
      createFocusNodeState(store)({
        form,
        focusNode,
      })

      // then
      expect(focusNode.out(schema.knows).out(rdf.type).terms).to.have.length(0)
    })
  })
})
