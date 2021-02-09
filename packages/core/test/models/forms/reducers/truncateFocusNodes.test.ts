import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { RecursivePartial } from '@shaperone/testing'
import { truncateFocusNodes } from '../../../../models/forms/reducers/truncateFocusNodes'
import { Store } from '../../../../state'
import { FocusNode } from '../../../../index'
import { testStore } from '../util'
import { FormState } from '../../../../models/forms'

describe('core/models/forms/reducers/truncateFocusNodes', () => {
  let store: Store
  let form: symbol
  let focusNode: FocusNode
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
    focusStack: FormState['focusStack']
  }

  beforeEach(() => {
    ({ form, store } = testStore())
    focusNode = clownface({ dataset: $rdf.dataset() }).blankNode('baz')
    formState = store.getState().forms.get(form)!
  })

  it('removes all states', () => {
    // given
    formState.focusStack = [
      focusNode.blankNode('foo'),
      focusNode.blankNode('bar'),
    ]
    formState.focusNodes = {
      foo: {},
      bar: {},
    }

    // when
    const afterState = truncateFocusNodes(store.getState().forms, {
      form,
    })

    // then
    expect(afterState.get(form)?.focusStack).to.have.length(0)
    expect(Object.values(afterState.get(form)!.focusNodes)).to.have.length(0)
  })

  it('leaves stack', () => {
    // given
    formState.focusStack = [
      focusNode.blankNode('foo'),
      focusNode.blankNode('bar'),
    ]
    formState.focusNodes = {
      foo: {},
      bar: {},
    }

    // when
    const afterState = truncateFocusNodes(store.getState().forms, {
      form,
      focusNode: focusNode.blankNode('bar'),
    })

    // then
    expect(afterState.get(form)?.focusStack).to.have.length(1)
    expect(afterState.get(form)?.focusStack[0].value).to.eq('foo')
  })
})
