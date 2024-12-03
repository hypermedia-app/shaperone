import type { SetObjectParams } from '../reducers/updateObject.js'
import type { Store } from '../../../state/index.js'
import { syncProperties } from './lib/syncProperties.js'

export function setObjectValue(store: Store) {
  const dispatch = store.getDispatch()

  return ({ focusNode, property }: Pick<SetObjectParams, 'focusNode' | 'property'>) => {
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
