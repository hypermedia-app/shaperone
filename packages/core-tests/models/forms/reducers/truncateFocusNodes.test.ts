import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import type { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form.js'
import { truncateFocusNodes } from '@hydrofoil/shaperone-core/models/forms/reducers/truncateFocusNodes.js'
import type { Store } from '@hydrofoil/shaperone-core/state'
import type { FocusNode } from '@hydrofoil/shaperone-core/index.js'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms'

describe('core/models/forms/reducers/truncateFocusNodes', () => {
  let store: Store
  let focusNode: FocusNode
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
    focusStack: FormState['focusStack']
  }

  beforeEach(() => {
    store = testStore()
    focusNode = $rdf.clownface({ dataset: $rdf.dataset() }).blankNode('baz')
    formState = store.getState().form
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
    const afterState = truncateFocusNodes(store.getState().form, {})

    // then
    expect(afterState.focusStack).to.have.length(0)
    expect(Object.values(afterState.focusNodes)).to.have.length(0)
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
    const afterState = truncateFocusNodes(store.getState().form, {
      focusNode: focusNode.blankNode('bar'),
    })

    // then
    expect(afterState.focusStack).to.have.length(1)
    expect(afterState.focusStack[0].value).to.eq('foo')
  })
})
