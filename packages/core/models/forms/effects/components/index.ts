import type { Store } from '../../../../state/index.js'

function resetComponents(store: Store) {
  const dispatch = store.getDispatch()

  return () => {
    dispatch.forms.resetComponents()
  }
}

export default (store: Store) => ({
  'components/pushComponents': resetComponents(store),
})
