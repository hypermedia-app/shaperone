import type { NodeShape } from '@rdfine/shacl'
import type { Store } from '../../../state/index.js'
import type { FocusNode } from '../../../index.js'
import { initialiseFocusNode } from '../lib/stateBuilder.js'
import { matchShapes } from '../../shapes/lib/index.js'

type StackAction = {appendToStack?: true} | {replaceStack?: true}

export type Params = {
  focusNode: FocusNode
  shape?: NodeShape
} & StackAction

export function createFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  return ({ focusNode, shape, ...rest } : Params) => {
    const { form: state, editors, shapes, components } = store.getState()

    const focusNodeState = initialiseFocusNode({
      focusNode,
      editors,
      shapes: matchShapes(shapes.shapes).to(focusNode),
      components,
      shouldEnableEditorChoice: state.shouldEnableEditorChoice,
      shape,
    }, state.focusNodes[focusNode.value])

    dispatch.form.replaceFocusNodeState({ focusNode: focusNodeState, ...rest })
  }
}
