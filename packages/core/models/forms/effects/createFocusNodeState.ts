import type { Store } from '../../../state'
import { BaseParams } from '../../index'

export function createFocusNodeState(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form }: BaseParams) => {
    dispatch.forms.validate({ form })
  }
}
