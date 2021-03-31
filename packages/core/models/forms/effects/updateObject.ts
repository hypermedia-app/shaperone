import { UpdateObjectParams } from '../reducers/updateObject'
import type { Store } from '../../../state'
import { syncProperties } from './lib/syncProperties'

export function updateObject(store: Store) {
  const dispatch = store.getDispatch()

  return ({ form, focusNode, property }: Pick<UpdateObjectParams, 'form' | 'focusNode' | 'property'>) => {
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
