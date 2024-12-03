import type { Store } from '../../../state/index.js'
import type { RemoveObjectParams } from '../reducers/removeObject.js'
import { syncProperties } from './lib/syncProperties.js'

export function removeObject(store: Store) {
  const dispatch = store.getDispatch()

  return ({ property, focusNode }: Pick<RemoveObjectParams, 'property' | 'focusNode'>) => {
    const { form, editors } = store.getState()

    syncProperties({
      dispatch,
      editors,
      form,
      focusNode,
      property,
    })

    dispatch.form.validate()
  }
}
