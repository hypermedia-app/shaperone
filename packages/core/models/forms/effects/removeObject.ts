import type { Store } from '../../../state'
import { RemoveObjectParams } from '../reducers/removeObject'
import { syncProperties } from './lib/syncProperties.js'

export function removeObject(store: Store) {
  const dispatch = store.getDispatch()

  return ({ property, form, focusNode }: Pick<RemoveObjectParams, 'form' | 'property' | 'focusNode'>) => {
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
