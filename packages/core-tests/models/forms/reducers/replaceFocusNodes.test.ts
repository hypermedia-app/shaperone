import { beforeEach, describe, it } from 'mocha'
import $rdf from '@shaperone/testing/env.js'
import { expect } from 'chai'
import type { RecursivePartial } from '@shaperone/testing'
import { testFocusNodeState, testStore } from '@shaperone/testing/models/form.js'
import { replaceFocusNodeState } from '@hydrofoil/shaperone-core/models/forms/reducers/replaceFocusNodes.js'
import type { FormState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { Store } from '@hydrofoil/shaperone-core/state/index.js'
import type { AnyPointer } from 'clownface'

describe('models/forms/reducers/replaceFocusNodes', () => {
  let store: Store
  let graph: AnyPointer
  let formState: {
    focusNodes: RecursivePartial<FormState['focusNodes']>
    focusStack: FormState['focusStack']
  }

  beforeEach(() => {
    store = testStore()
    graph = $rdf.clownface()
    formState = store.getState().form
  })

  describe('createFocusNodeState', () => {
    it('replaces existing stack given parameter', () => {
      // given
      formState.focusStack = [
        graph.blankNode('foo'),
        graph.blankNode('bar'),
      ]

      // when
      const afterForm = replaceFocusNodeState(store.getState().form, {
        focusNode: testFocusNodeState(graph.blankNode('baz')).baz,
        replaceStack: true,
      })

      // then
      expect(afterForm?.focusStack).to.have.length(1)
      expect(afterForm?.focusStack[0].term).to.deep.eq($rdf.blankNode('baz'))
    })

    it('appends to stack given parameter', () => {
      // given
      formState.focusStack = [
        graph.blankNode('foo'),
        graph.blankNode('bar'),
      ]

      // when
      const afterForm = replaceFocusNodeState(store.getState().form, {
        focusNode: testFocusNodeState(graph.blankNode('baz')).baz,
        appendToStack: true,
      })

      // then
      expect(afterForm?.focusStack).to.have.length(3)
      expect(afterForm?.focusStack.map(fn => fn.term)).to.deep.contain.ordered.members([
        $rdf.blankNode('foo'),
        $rdf.blankNode('bar'),
        $rdf.blankNode('baz'),
      ])
    })
  })
})
