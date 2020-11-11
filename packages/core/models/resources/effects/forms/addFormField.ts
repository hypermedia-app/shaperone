import { BaseParams } from '../../../forms/reducers'
import { getPathProperty } from '../../lib/property'
import type { Store } from '../../../../state'
import { notify } from '../../lib/notify'
import { Params } from '../../../forms/reducers/addFormField'
import { defaultValue } from '../../lib/defaultValue'

export default function (store: Store) {
  const dispatch = store.getDispatch()

  return function ({ form, focusNode, property }: BaseParams & Params): void {
    const { resources } = store.getState()
    const state = resources.get(form)

    if (state?.graph) {
      const pointer = defaultValue(property, focusNode)

      if (pointer.values.length) {
        state.graph.node(focusNode).addOut(getPathProperty(property)!.id, pointer)

        const { forms, editors } = store.getState()
        const formState = forms.instances.get(form)
        const current = formState?.focusNodes[focusNode.value]
        if (formState && current) {
          dispatch.forms.createFocusNodeState({
            form,
            focusNode,
            shapes: current.shapes,
            shape: current.shape,
            editors,
            shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
          })
        }

        notify({
          store,
          form,
          property,
          focusNode,
        })
      }
    }
  }
}
