import { DatasetCore } from 'rdf-js'
import cf, { AnyPointer } from 'clownface'
import { produce } from 'immer'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import * as NodeShape from '@rdfine/shacl/lib/NodeShape'
import { BaseParams, formStateReducer } from '../index.js'
import type { ShapeState } from '.'
import { emptyState } from './lib/index.js'

export interface SetShapesGraphParams extends BaseParams {
  shapesGraph: DatasetCore | AnyPointer
}

function findShapes(shapesPointer: AnyPointer) {
  return shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => NodeShape.fromPointer(pointer))
}

function getPreferredShape(pointer: AnyPointer) {
  if (!pointer.term) {
    return undefined
  }

  return NodeShape.fromPointer(pointer as any)
}

export const setGraph = formStateReducer((state: ShapeState, { shapesGraph }: SetShapesGraphParams) => produce(state, (draft) => {
  if ('match' in shapesGraph) {
    // new dataset
    const pointer = cf({ dataset: shapesGraph })
    draft.shapesGraph = pointer
    draft.shapes = findShapes(pointer)
    return
  }

  const newDataset = state.shapesGraph?.dataset !== shapesGraph.dataset
  const newAnyPointer = shapesGraph !== state.shapesGraph && (!shapesGraph.term || !state.shapesGraph?.term)

  if (newDataset || newAnyPointer) {
    // pointer to a different dataset
    draft.shapesGraph = shapesGraph
    draft.shapes = findShapes(shapesGraph)
    draft.preferredRootShape = getPreferredShape(shapesGraph)
    return
  }

  if (shapesGraph.term && !shapesGraph.term.equals(state.shapesGraph?.term)) {
    // same dataset, changed pointer
    draft.shapes = findShapes(shapesGraph)
    draft.preferredRootShape = getPreferredShape(shapesGraph)
  }
}), emptyState)
