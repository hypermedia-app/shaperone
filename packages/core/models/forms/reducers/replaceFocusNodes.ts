import { produce } from 'immer'
import { initialiseFocusNode } from '../lib/stateBuilder.js'
import type { FormState } from '../index.js'
import { matchShapes } from '../../shapes/lib/index.js'

type StackAction = {appendToStack?: true} | {replaceStack?: true}

export type Params = Parameters<typeof initialiseFocusNode>[0] & StackAction

export const createFocusNodeState = (state: FormState, { focusNode, ...rest }: Params) => produce(state, (draft) => {
  let { shapes } = rest

  if ('appendToStack' in rest && rest.appendToStack) {
    draft.focusStack.push(focusNode)
    shapes = matchShapes(shapes).to(focusNode)
  }

  if ('replaceStack' in rest && rest.replaceStack) {
    draft.focusStack = [focusNode]
    shapes = matchShapes(shapes).to(focusNode)
  }

  draft.focusStack = draft.focusStack.map(node => (node.term.equals(focusNode.term) ? focusNode : node))
  draft.focusNodes[focusNode.value] = initialiseFocusNode({
    focusNode,
    ...rest,
    shapes,
  }, state.focusNodes[focusNode.value])
})
