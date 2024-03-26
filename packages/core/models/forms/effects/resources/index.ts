import type { Store } from '../../../../state/index.js'
import setRoot from './setRoot.js'

export default (store: Store) => ({
  'resources/setRoot': setRoot(store),
})
