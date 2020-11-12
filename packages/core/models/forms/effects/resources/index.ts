import type { Store } from '../../../../state'
import setRoot from './setRoot'

export default (store: Store) => ({
  'resources/setRoot': setRoot(store),
})
