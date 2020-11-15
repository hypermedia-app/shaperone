import { DatasetCore } from 'rdf-js'
import cf, { AnyPointer } from 'clownface'
import produce from 'immer'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { Shape, ShapeMixin } from '@rdfine/shacl'
import { BaseParams, formStateReducer } from '../index'
import type { ShapeState } from '.'

export interface SetShapesGraphParams extends BaseParams {
  shapesGraph: DatasetCore | AnyPointer
}

function findShapes(shapesPointer: AnyPointer) {
  return shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => RdfResource.factory.createEntity<Shape>(pointer, [ShapeMixin]))
}

function getPreferredShape(pointer: AnyPointer) {
  if (!pointer.term) {
    return undefined
  }

  return RdfResource.factory.createEntity<Shape>(pointer as any, [ShapeMixin])
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
}))
