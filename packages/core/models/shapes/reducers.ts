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
  if (state.shapesGraph === shapesGraph) {
    return
  }

  const shapesPointer = 'match' in shapesGraph ? cf({ dataset: shapesGraph }) : shapesGraph.any()
  const shapes = shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => RdfResource.factory.createEntity<Shape>(pointer, [ShapeMixin]))

  draft.shapesGraph = shapesPointer
  draft.shapes = shapes
}))
