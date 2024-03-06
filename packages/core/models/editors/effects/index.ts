import type { Dispatch, Store } from '../../../state/index.js'

export function loadDash(store: Store) {
  let dashLoaded = false
  const dispatch: Dispatch = store.getDispatch()

  return async () => {
    if (dashLoaded) return

    const dash = (await import('@vocabulary/dash')).default
    const DashEditors = await import('../../../DashEditors.js')

    dispatch.editors.addMetadata(factory => dash({ factory }))
    dispatch.editors.addMatchers(DashEditors)
    dashLoaded = true
  }
}
