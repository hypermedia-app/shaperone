import { createModel } from '@captaincodeman/rdx'
import { NodeShape } from '@rdfine/shacl'
import { AnyPointer } from 'clownface'
import { setGraph } from './reducers'

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
      map.set(form, {
        shapes: [],
      })

      return map
    },
    setGraph,
  },
})
