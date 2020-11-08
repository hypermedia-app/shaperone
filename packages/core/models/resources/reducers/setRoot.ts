import { GraphPointer } from 'clownface'
import type { State } from '../index'
import { BaseParams } from '../../index'
import { FocusNode } from '../../../index'

export interface Params extends BaseParams {
  rootPointer: GraphPointer<FocusNode>
}

export function setRoot(map: State, { form, rootPointer }: Params) {
  const instance = map.get(form)
  if (instance) {
    instance.graph = rootPointer.any()
  }

  return map
}
