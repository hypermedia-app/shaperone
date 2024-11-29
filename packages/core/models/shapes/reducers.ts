import type { DatasetCore } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import { produce } from 'immer'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { NodeShape } from '@rdfine/shacl'
import type { BaseParams } from '../index.js'
import { formStateReducer } from '../index.js'
import type { ShapeState } from './index.js'
import { emptyState } from './lib/index.js'
import env from '../../env.js'

export interface SetShapesGraphParams extends BaseParams {
  shapesGraph: DatasetCore | AnyPointer
}

function findShapes(shapesPointer: AnyPointer) {
  return shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => env().rdfine.sh.NodeShape(pointer))
}

function getPreferredShape(pointer: AnyPointer, shapes: NodeShape[]) {
  if (pointer.term) {
    return env().rdfine.sh.NodeShape(pointer as any)
  }

  if (shapes.length === 1) {
    return shapes[0]
  }

  return undefined
}

export const setGraph = formStateReducer((state: ShapeState, { shapesGraph }: SetShapesGraphParams) => produce(state, (draft) => {
  if ('match' in shapesGraph) {
    // new dataset
    const pointer = env().clownface({ dataset: shapesGraph })
    const shapes = findShapes(pointer)
    draft.shapesGraph = pointer
    draft.shapes = shapes
    draft.preferredRootShape = getPreferredShape(pointer, shapes)
    return
  }

  const newDataset = state.shapesGraph?.dataset !== shapesGraph.dataset
  const newAnyPointer = shapesGraph !== state.shapesGraph && (!shapesGraph.term || !state.shapesGraph?.term)

  const shapes = findShapes(shapesGraph)
  if (newDataset || newAnyPointer) {
    // pointer to a different dataset
    draft.shapesGraph = shapesGraph
    draft.shapes = shapes
    draft.preferredRootShape = getPreferredShape(shapesGraph, shapes)
    return
  }

  if (shapesGraph.term && !shapesGraph.term.equals(state.shapesGraph?.term)) {
    // same dataset, changed pointer
    draft.shapes = shapes
    draft.preferredRootShape = getPreferredShape(shapesGraph, shapes)
  }
}), emptyState)
