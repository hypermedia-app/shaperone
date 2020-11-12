import type { Store } from '../../../../state'
import setGraph from './setGraph'

export default (store: Store) => ({
  'shapes/setGraph': setGraph(store),
})
