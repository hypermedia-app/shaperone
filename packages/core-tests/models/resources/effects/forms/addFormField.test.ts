import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { AnyPointer } from 'clownface'
import { xsd, sh } from '@tpluscode/rdf-ns-builders'
import { schema } from '@tpluscode/rdf-ns-builders/loose'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import addFormField from '@hydrofoil/shaperone-core/models/resources/effects/forms/addFormField.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { propertyShape } from '@shaperone/testing/util.js'

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
      selectedEditor: undefined,
      nodeKind: undefined,
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
      selectedEditor: undefined,
      nodeKind: undefined,
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
        selectedEditor: undefined,
        nodeKind: undefined,
      })

      // then
      expect(focusNode.out(schema.vehicleTransmission).term?.termType).to.eq('BlankNode')
    })
  })
})
