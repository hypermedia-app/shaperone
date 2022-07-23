import type { Store } from '../../../state'
import { ReplaceObjectsParams } from '../reducers/updateObject'
import { syncProperties } from './lib/syncProperties.js'

export function setPropertyObjects(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, focusNode, property }: Pick<ReplaceObjectsParams, 'form' | 'focusNode' | 'property'>) => {
    const { forms, editors } = store.getState()

    syncProperties({
      dispatch,
      editors,
      forms,
      form,
      focusNode,
      property,
    })

    dispatch.forms.validate({ form })
  }
}
