import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { AnyPointer } from 'clownface'
import { xsd, schema } from '@tpluscode/rdf-ns-builders'
import addFormField from '../../../../../models/resources/effects/forms/addFormField'
import { Store } from '../../../../../state'
import { RecursivePartial, testStore } from '../../../forms/util'
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
    formState = store.getState().forms.instances.get(form)!;
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
        shape: property,
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
})
