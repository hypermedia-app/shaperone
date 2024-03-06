import type { Store } from '../../../../state/index.js'

function recalculateEditors(store: Store) {
  const dispatch = store.getDispatch()

  return () => {
    dispatch.forms.recalculateEditors({ editors: store.getState().editors })
  }
}

export default (store: Store) => ({
  'editors/addMetadata': recalculateEditors(store),
  'editors/addMatchers': recalculateEditors(store),
})
