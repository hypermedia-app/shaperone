import { defaultValue } from '../../lib/defaultValue'
import { getPathProperty } from '../../lib/property'
import { notify } from '../../lib/notify'
import type { Store } from '../../../../state'
import { Params } from '../../../forms/reducers/replaceFocusNodes'

export default function createFocusNodeState(store: Store) {
  return function ({ form, focusNode }: Params) {
    const dispatch = store.getDispatch()
    const { editors } = store.getState()

    for (const property of store.getState().forms.get(form)?.focusNodes[focusNode.value].properties || []) {
      let shouldNotify = false
      for (const object of property.objects) {
        if (!object.object) {
          const [value] = defaultValue(property.shape, focusNode)?.toArray() || []

          if (value) {
            shouldNotify = true
            focusNode.addOut(getPathProperty(property.shape)!.id, value)
            dispatch.forms.setObjectValue({
              form,
              focusNode,
              property: property.shape,
              object,
              value,
              editors,
            })
          }
        }
      }

      if (shouldNotify) {
        notify({
          form,
          focusNode,
          property: property.shape,
          store,
        })
      }
    }
  }
}
