import { SetObjectParams } from '../reducers/updateObject.js'
import type { Store } from '../../../state/index.js'
import { syncProperties } from './lib/syncProperties.js'

export function setObjectValue(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, focusNode, property }: Pick<SetObjectParams, 'form' | 'focusNode' | 'property'>) => {
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
