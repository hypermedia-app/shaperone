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

export const setGraph = formStateReducer((state: ShapeState, { shapesGraph }: SetShapesGraphParams) => produce(state, (draft) => {
  if ('dataset' in shapesGraph) {
    if (state.shapesGraph?.dataset === shapesGraph.dataset) {
      const samePreferredRootShape = !state.preferredRootShape || (state.preferredRootShape && state.preferredRootShape.equals(shapesGraph.term as any))
      if (samePreferredRootShape) {
        return
      }
    }
  } else if (state.shapesGraph?.dataset === shapesGraph) {
    return
  }

  let preferredRootShape: Shape | undefined
  let shapesPointer: AnyPointer
  if ('match' in shapesGraph) {
    shapesPointer = cf({ dataset: shapesGraph })
  } else {
    shapesPointer = shapesGraph.any()
    if (shapesGraph.term) {
      preferredRootShape = RdfResource.factory.createEntity<Shape>(shapesGraph as any, [ShapeMixin])
    }
  }

  const shapes = shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => RdfResource.factory.createEntity<Shape>(pointer, [ShapeMixin]))

  draft.shapesGraph = shapesPointer
  draft.shapes = shapes
  draft.preferredRootShape = preferredRootShape
}))
