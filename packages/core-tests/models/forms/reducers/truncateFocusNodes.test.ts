import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { truncateFocusNodes } from '@hydrofoil/shaperone-core/models/forms/reducers/truncateFocusNodes.js'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FocusNode } from '@hydrofoil/shaperone-core/index'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'

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
    focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode('baz')
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
