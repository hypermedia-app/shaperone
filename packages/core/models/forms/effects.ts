import type { Store } from '../../state/index'

export function effects(store: Store) {
  const dispatch = store.getDispatch()

  return {
    'editors/addMatchers': () => {
      const { editors: { singleEditors, multiEditors } } = store.getState()
      dispatch.forms.setEditors({
        singleEditors: [...Object.values(singleEditors)],
        multiEditors: [...Object.values(multiEditors)],
      })
    },
  }
}
