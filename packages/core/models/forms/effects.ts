import { PropertyShape } from '@rdfine/shacl'
import type { Store } from '../../state/index'
import { Editor, MultiEditor, SingleEditor } from '../editors'
import { BaseParams } from './reducers'
import { FocusNode } from '../../index'

function toDefined<T>(arr: T[], next: T | undefined): T[] {
  if (!next) {
    return arr
  }

  return [...arr, next]
}

function notify(store: Store) {
  return ({ form, ...params }: BaseParams & { focusNode: FocusNode; property: PropertyShape }) => {
    const { forms } = store.getState()
    forms.instances.get(form)?.changeNotifier.notify({
      ...params,
    })
  }
}

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'editors/addMatchers': () => {
      const { editors } = store.getState()
      const singleEditors = Object.values(editors.singleEditors).reduce<Editor<SingleEditor>[]>(toDefined, [])
      const multiEditors = Object.values(editors.multiEditors).reduce<Editor<MultiEditor>[]>(toDefined, [])

      dispatch.forms.setEditors({
        singleEditors,
        multiEditors,
      })
    },
    'forms/addObject': notify(store),
    'forms/updateObject': notify(store),
    'forms/removeObject': notify(store),
    'forms/replaceObjects': notify(store),
  }
}
