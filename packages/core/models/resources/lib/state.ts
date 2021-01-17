import type { ResourceState } from '../index'
import { ChangeNotifier } from './notify'
import type { FocusNode } from '../../../index'

export function createState(rootPointer: FocusNode): ResourceState {
  return {
    rootPointer,
    get graph() {
      return this.rootPointer.any()
    },
    changeNotifier: new ChangeNotifier(),
  }
}
