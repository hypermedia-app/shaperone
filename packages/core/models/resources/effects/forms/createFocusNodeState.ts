/* eslint-disable no-continue */
import { GraphPointer } from 'clownface'
import { defaultValue } from '../../lib/defaultValue'
import { getPathProperty } from '../../lib/property'
import { notify } from '../../lib/notify'
import type { Store } from '../../../../state'
import { Params } from '../../../forms/reducers/replaceFocusNodes'

export default function createFocusNodeState(store: Store) {
  return function ({ form, focusNode }: Pick<Params, 'form' | 'focusNode'>) {
    const dispatch = store.getDispatch()
    const { editors } = store.getState()

    for (const property of store.getState().forms.get(form)?.focusNodes[focusNode.value].properties || []) {
      let shouldNotify = false
      let previousDefault: GraphPointer | undefined
      for (const object of property.objects) {
        if (!object.object) {
          const [value] = defaultValue(property.shape, focusNode)?.toArray() || []

          if (!value) {
            continue
          }

          if (value.term.equals(previousDefault?.term)) {
            continue
          }

          const predicate = getPathProperty(property.shape)!.id
          if (focusNode.has(predicate, value).terms.length) {
            continue
          }

          shouldNotify = true
          previousDefault = value
          focusNode.addOut(predicate, value)
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
