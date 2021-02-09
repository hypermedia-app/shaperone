import { describe, it } from 'mocha'
import { expect } from 'chai'
import $rdf from 'rdf-ext'
import { AnyPointer } from 'clownface'
import { schema } from '@tpluscode/rdf-ns-builders'
import { RecursivePartial } from '@shaperone/testing'
import addFormField from '../../../../../models/resources/effects/forms/createFocusNodeState'
import { Store } from '../../../../../state'
import { testStore } from '../../../forms/util'
import { propertyShape } from '../../../../util'
import { FormState } from '../../../../../models/forms'

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
    addFormField(store)({
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
    addFormField(store)({
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
    addFormField(store)({
      form,
      focusNode,
    })

    // then
    expect(store.getDispatch().forms.setObjectValue).not.to.have.been.called
  })
})
