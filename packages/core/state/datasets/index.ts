import { createModel } from '@captaincodeman/rdx'
import { DatasetsState } from './state'
import { Store } from '../../state'
import { effects } from './effects'
import { FocusNode } from '../../index'
import { RdfResource } from '@tpluscode/rdfine'

export const datasets = createModel(({
  state: <DatasetsState>{},
  reducers: {
    replaceShape(state, shape: RdfResource) {
      if (!shape) return state

      return {
        ...state,
        shape: shape._selfGraph.dataset,
      }
    },
    replaceResource(state, resource: FocusNode) {
      if (!resource) return state

      return {
        ...state,
        resource: resource.dataset,
      }
    },
  },
  effects: (store: Store) => effects(store),
}))
