import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from '@zazuko/env/web.js'
import type { AnyPointer } from 'clownface'
import type { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import addFormField from '@hydrofoil/shaperone-core/models/resources/effects/forms/addFormField.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms'
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
      defaultValue: $rdf.literal('10', $rdf.ns.xsd.int),
      path: $rdf.ns.foaf.age,
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
      overrides: undefined,
    })

    // then
    expect(focusNode.out($rdf.ns.foaf.age).term).to.deep.eq($rdf.literal('10', $rdf.ns.xsd.int))
  })

  it('does not add any node when there is not nodeKind', () => {
    // given
    const focusNode = graph.blankNode()
    const property = propertyShape({
      path: $rdf.ns.schema.vehicleTransmission,
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
      overrides: undefined,
    })

    // then
    expect(focusNode.out($rdf.ns.schema.vehicleTransmission).term?.termType).to.be.undefined
  });

  [$rdf.ns.sh.BlankNode, $rdf.ns.sh.BlankNodeOrIRI].forEach((nodeKind) => {
    it(`adds new blank node to the graph when node kind is ${nodeKind.value}`, () => {
      // given
      const focusNode = graph.blankNode()
      const property = propertyShape({
        nodeKind,
        path: $rdf.ns.schema.vehicleTransmission,
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
        overrides: undefined,
      })

      // then
      expect(focusNode.out($rdf.ns.schema.vehicleTransmission).term?.termType).to.eq('BlankNode')
    })
  })
})
