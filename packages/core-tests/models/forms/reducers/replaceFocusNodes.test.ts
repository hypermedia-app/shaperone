import { beforeEach, describe, it } from 'mocha'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { expect } from 'chai'
import { RecursivePartial } from '@shaperone/testing'
import { testStore } from '@shaperone/testing/models/form'
import { createFocusNodeState } from '@hydrofoil/shaperone-core/models/forms/reducers/replaceFocusNodes'
import { FormState } from '@hydrofoil/shaperone-core/models/forms'
import { Store } from '@hydrofoil/shaperone-core/state'
import { FocusNode } from '@hydrofoil/shaperone-core/index'
import { initialiseFocusNode } from '@hydrofoil/shaperone-core/models/forms/lib/stateBuilder'

describe('models/forms/reducers/replaceFocusNodes', () => {
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

  function commonParams(): Parameters<typeof initialiseFocusNode>[0] {
    return {
      focusNode,
      shapes: [],
      components: store.getState().components,
      editors: store.getState().editors,
      shouldEnableEditorChoice: () => true,
    }
  }

  describe('createFocusNodeState', () => {
    it('replaces existing stack given parameter', () => {
      // given
      formState.focusStack = [
        focusNode.blankNode('foo'),
        focusNode.blankNode('bar'),
      ]

      // when
      const afterState = createFocusNodeState(store.getState().forms, {
        form,
        ...commonParams(),
        replaceStack: true,
      })

      // then
      const afterForm = afterState.get(form)
      expect(afterForm?.focusStack).to.have.length(1)
      expect(afterForm?.focusStack[0].term).to.deep.eq(focusNode.term)
    })

    it('appends to stack given parameter', () => {
      // given
      formState.focusStack = [
        focusNode.blankNode('foo'),
        focusNode.blankNode('bar'),
      ]

      // when
      const afterState = createFocusNodeState(store.getState().forms, {
        form,
        ...commonParams(),
        appendToStack: true,
      })

      // then
      const afterForm = afterState.get(form)
      expect(afterForm?.focusStack).to.have.length(3)
      expect(afterForm?.focusStack.map(fn => fn.term)).to.deep.contain.ordered.members([
        $rdf.blankNode('foo'),
        $rdf.blankNode('bar'),
        focusNode.term,
      ])
    })
  })
})
