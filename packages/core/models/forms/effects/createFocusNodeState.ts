import type { Store } from '../../../state/index.js'
import { BaseParams } from '../../index.js'

export function createFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form }: BaseParams) => {
    dispatch.forms.validate({ form })
  }
}
