import { rdfs } from '@tpluscode/rdf-ns-builders'
import type { Store } from '../../state/index'
import * as setRoot from '../resources/reducers/setRoot'

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'shapes/setGraph': ({ form }: { form: symbol }) => {
      const focusNodes = store.getState().forms.instances.get(form)?.focusNodes || {}
      const graph = store.getState().resources.get(form)?.graph
      if (!graph) {
        return
      }

      Object.values(focusNodes).forEach((state) => {
        const { focusNode } = state

        dispatch.forms.replaceFocusNodes({
          form,
          focusNode,
          label: graph.node(focusNode).out(rdfs.label).value || 'Resource',
        })
      })
    },
    'resources/setRoot': ({ form, rootPointer }: setRoot.Params) => {
      const { forms } = store.getState()
      const formState = forms.instances.get(form)

      if (!formState?.focusStack.length || rootPointer.value !== formState?.focusStack[0].value) {
        dispatch.forms.replaceFocusNodes({
          form,
          focusNode: rootPointer.term,
          label: rootPointer.out(rdfs.label).value || 'Resource',
        })
      }
    },
  }
}
