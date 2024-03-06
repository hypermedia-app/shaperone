import type { ResourceState } from '../index.js'
import { ChangeNotifier } from './notify.js'
import type { FocusNode } from '../../../index.js'

export function createState(rootPointer: FocusNode): ResourceState {
  return {
    rootPointer,
    get graph() {
      return this.rootPointer.any()
    },
    changeNotifier: new ChangeNotifier(),
  }
}
