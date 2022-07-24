import * as $rdf from '@rdf-esm/dataset'
import type { Dispatch, Store } from '../../../state'

export function loadDash(store: Store) {
  let dashLoaded = false
  const dispatch: Dispatch = store.getDispatch()

  return async () => {
    if (dashLoaded) return

    const dash = (await import('@zazuko/rdf-vocabularies/datasets/dash')).default
    const DashEditors = await import('../../../DashEditors.js')

    dispatch.editors.addMetadata(dash($rdf))
    dispatch.editors.addMatchers(DashEditors)
    dashLoaded = true
  }
}
