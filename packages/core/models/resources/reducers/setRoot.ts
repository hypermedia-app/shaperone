import type { State } from '../index.js'
import type { BaseParams } from '../../index.js'
import type { FocusNode } from '../../../index.js'
import { createState } from '../lib/state.js'

export interface Params extends BaseParams {
  rootPointer: FocusNode
}

export function setRoot(map: State, { form, rootPointer }: Params) {
  const instance = map.get(form)
  if (instance) {
    instance.rootPointer = rootPointer
    return map
  }

  return map.set(form, createState(rootPointer))
}
