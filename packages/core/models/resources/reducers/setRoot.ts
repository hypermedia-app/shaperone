import type { State } from '../index.js'
import type { FocusNode } from '../../../index.js'

export interface Params {
  rootPointer: FocusNode
}

export function setRoot(state: State, { rootPointer }: Params) {
  return {
    ...state,
    rootPointer,
    graph: rootPointer.any(),
  }
}
