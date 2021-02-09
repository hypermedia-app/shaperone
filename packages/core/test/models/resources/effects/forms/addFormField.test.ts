import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { AnyPointer } from 'clownface'
import { xsd, schema, sh } from '@tpluscode/rdf-ns-builders'
import { RecursivePartial } from '@shaperone/testing'
import addFormField from '../../../../../models/resources/effects/forms/addFormField'
import { Store } from '../../../../../state'
import { testStore } from '../../../forms/util'
import { propertyShape } from '../../../../util'
import { FormState } from '../../../../../models/forms'

describe('models/resources/effects/forms/addFormField', () => {
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

  it('adds sh:defaultValue to graph', () => {
    // given
    const focusNode = graph.blankNode()
    const property = propertyShape({
      defaultValue: $rdf.literal('10', xsd.int),
      path: schema.age,
    })
    formState.focusNodes = {
      [focusNode.value]: {
      },
    }

    // when
    addFormField(store)({
      form,
      focusNode,
      property,
    })

    // then
    expect(focusNode.out(schema.age).term).to.deep.eq($rdf.literal('10', xsd.int))
  })

  it('does not add any node when there is not nodeKind', () => {
    // given
    const focusNode = graph.blankNode()
    const property = propertyShape({
      path: schema.vehicleTransmission,
    })
    formState.focusNodes = {
      [focusNode.value]: {
      },
    }

    // when
    addFormField(store)({
      form,
      focusNode,
      property,
    })

    // then
    expect(focusNode.out(schema.vehicleTransmission).term?.termType).to.be.undefined
  });

  [sh.BlankNode, sh.BlankNodeOrIRI].forEach((nodeKind) => {
    it(`adds new blank node to the graph when node kind is ${nodeKind.value}`, () => {
      // given
      const focusNode = graph.blankNode()
      const property = propertyShape({
        nodeKind,
        path: schema.vehicleTransmission,
      })
      formState.focusNodes = {
        [focusNode.value]: {
        },
      }

      // when
      addFormField(store)({
        form,
        focusNode,
        property,
      })

      // then
      expect(focusNode.out(schema.vehicleTransmission).term?.termType).to.eq('BlankNode')
    })
  })
})
