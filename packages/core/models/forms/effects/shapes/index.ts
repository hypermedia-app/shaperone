import type { Store } from '../../../../state/index.js'
import setGraph from './setGraph.js'

export default (store: Store) => ({
  'shapes/setGraph': setGraph(store),
})
