import type { Store } from '../../../state/index.js'
import type { ReplaceObjectsParams } from '../reducers/updateObject.js'
import { syncProperties } from './lib/syncProperties.js'

export function setPropertyObjects(store: Store) {
  const dispatch = store.getDispatch()

  return ({ focusNode, property }: Pick<ReplaceObjectsParams, 'focusNode' | 'property'>) => {
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
