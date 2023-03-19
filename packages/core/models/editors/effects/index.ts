import $rdf from 'rdf-ext'
import type { Dispatch, Store } from '../../../state'

export function loadDash(store: Store) {
  let dashLoaded = false
  const dispatch: Dispatch = store.getDispatch()

  return async () => {
    if (dashLoaded) return

    const dash = (await import('@vocabulary/dash')).default
    const DashEditors = await import('../../../DashEditors.js')

    dispatch.editors.addMetadata(dash({ factory: $rdf }))
    dispatch.editors.addMatchers(DashEditors)
    dashLoaded = true
  }
}
