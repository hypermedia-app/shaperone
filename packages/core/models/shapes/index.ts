import { createModel } from '@captaincodeman/rdx'
import type { NodeShape } from '@rdfine/shacl'
import type { AnyPointer } from 'clownface'
import { setGraph } from './reducers.js'

export interface ShapeState {
  shapesGraph?: AnyPointer
  shapes: NodeShape[]
  preferredRootShape?: NodeShape
}

export type State = ShapeState

export const shapes = createModel({
  state: <ShapeState> {
    shapes: [],
  },
  reducers: {
    setGraph,
  },
})
