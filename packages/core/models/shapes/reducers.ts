import type { DatasetCore } from '@rdfjs/types'
import type { AnyPointer } from 'clownface'
import produce from 'immer'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import { BaseParams, formStateReducer } from '../index.js'
import type { ShapeState } from './index.js'
import { emptyState } from './lib/index.js'
import { ShaperoneEnvironment } from '../../env.js'

export interface SetShapesGraphParams extends BaseParams {
  shapesGraph: DatasetCore | AnyPointer
}

function findShapes(env: ShaperoneEnvironment, shapesPointer: AnyPointer) {
  return shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => env.rdfine.sh.NodeShape(pointer))
}

function getPreferredShape(env: ShaperoneEnvironment, pointer: AnyPointer) {
  if (!pointer.term) {
    return undefined
  }

  return env.rdfine.sh.NodeShape(pointer as any)
}

export const setGraph = formStateReducer((state: ShapeState, { shapesGraph }: SetShapesGraphParams, env: ShaperoneEnvironment) => produce(state, (draft) => {
  if ('match' in shapesGraph) {
    // new dataset
    const pointer = env.clownface({ dataset: shapesGraph })
    draft.shapesGraph = pointer
    draft.shapes = findShapes(env, pointer)
    return
  }

  const newDataset = state.shapesGraph?.dataset !== shapesGraph.dataset
  const newAnyPointer = shapesGraph !== state.shapesGraph && (!shapesGraph.term || !state.shapesGraph?.term)

  if (newDataset || newAnyPointer) {
    // pointer to a different dataset
    draft.shapesGraph = shapesGraph
    draft.shapes = findShapes(env, shapesGraph)
    draft.preferredRootShape = getPreferredShape(env, shapesGraph)
    return
  }

  if (shapesGraph.term && !shapesGraph.term.equals(state.shapesGraph?.term)) {
    // same dataset, changed pointer
    draft.shapes = findShapes(env, shapesGraph)
    draft.preferredRootShape = getPreferredShape(env, shapesGraph)
  }
}), emptyState)
