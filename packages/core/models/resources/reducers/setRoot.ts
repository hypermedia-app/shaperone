import type { State } from '../index.js'
import type { FocusNode } from '../../../index.js'

export interface Params {
  rootPointer: FocusNode
}

export function setRoot(instance: State, { rootPointer }: Params) {
  instance.rootPointer = rootPointer
  instance.graph = rootPointer.any()
  return instance
}
