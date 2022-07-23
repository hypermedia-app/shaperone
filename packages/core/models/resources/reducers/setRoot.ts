import type { State } from '../index'
import { BaseParams } from '../../index'
import { FocusNode } from '../../../index'
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
