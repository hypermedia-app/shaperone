import { PropertyShape } from '@rdfine/shacl'
import type { Store } from '../../../state'
import { FocusNode } from '../../../index'
import { BaseParams } from '../../index'

export function addObject(store: Store) {
  const dispatch = store.getDispatch()
  return function ({ form, property, focusNode }: { focusNode: FocusNode; property: PropertyShape } & BaseParams) {
    const { editors, resources } = store.getState()
    const graph = resources.get(form)?.graph
    if (!graph) {
      return
    }

    dispatch.forms.addFormField({
      form,
      property,
      focusNode,
      matchedEditors: editors.matchSingleEditors({ shape: property }),
      editors,
    })
  }
}
