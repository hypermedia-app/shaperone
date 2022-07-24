import { createModel } from '@captaincodeman/rdx'
import { NodeShape } from '@rdfine/shacl'
import { AnyPointer } from 'clownface'
import { setGraph } from './reducers'
import { emptyState } from './lib/index.js'

export interface ShapeState {
  shapesGraph?: AnyPointer
  shapes: NodeShape[]
  preferredRootShape?: NodeShape
}

export type State = Map<symbol, ShapeState>

export const shapes = createModel({
  state: new Map() as State,
  reducers: {
    connect(map: State, form: symbol) {
      if (map.has(form)) {
        return map
      }

      return map.set(form, emptyState())
    },
    disconnect(map: State, form: symbol) {
      map.delete(form)
      return map
    },
    setGraph,
  },
})
