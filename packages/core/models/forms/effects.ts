import type { Store } from '../../state/index'
import { Editor, MultiEditor, SingleEditor } from '../editors'

function toDefined<T>(arr: T[], next: T | undefined): T[] {
  if (!next) {
    return arr
  }

  return [...arr, next]
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
  }
}
