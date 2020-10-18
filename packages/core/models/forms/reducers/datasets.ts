import { DatasetCore } from 'rdf-js'
import cf, { AnyPointer } from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { Shape, ShapeMixin } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import type { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import type { FocusNodeState } from '../index'

export interface SetShapesGraphParams {
  shapesGraph: DatasetCore | AnyPointer
}

export const setShapesGraph = formStateReducer<SetShapesGraphParams>(({ state, editors, multiEditors }, { shapesGraph }) => {
  if (state.shapesGraph === shapesGraph) {
    return state
  }

  const shapesPointer = 'match' in shapesGraph ? cf({ dataset: shapesGraph }) : shapesGraph
  const shapes = shapesPointer
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => RdfResource.factory.createEntity<Shape>(pointer, [ShapeMixin]))

  return produce(state, (draft) => {
    draft.shapesGraph = shapesPointer
    draft.shapes = shapes

    const focusNodes = [...Object.values(state.focusNodes)].reduce<Record<string, FocusNodeState>>((focusNodes, focusNodeState) => {
      const { focusNode } = focusNodeState

      return {
        ...focusNodes,
        [focusNode.value]: initialiseFocusNode({
          focusNode,
          shapes,
          shape: shapes.find(s => s.id.equals(focusNodeState.shape?.id)),
          editors,
          multiEditors,
          shouldEnableEditorChoice: state.shouldEnableEditorChoice,
        }, state.focusNodes[focusNode.value]),
      }
    }, {})

    const missingNodes = state.focusStack.reduce<Record<string, FocusNodeState>>((missingNodes, focusNode) => {
      if (focusNodes[focusNode.value]) return missingNodes

      return {
        ...missingNodes,
        [focusNode.value]: initialiseFocusNode({
          focusNode,
          shapes,
          editors,
          multiEditors,
          shouldEnableEditorChoice: state.shouldEnableEditorChoice,
        }, state.focusNodes[focusNode.value]),
      }
    }, {})

    draft.focusNodes = { ...focusNodes, ...missingNodes }
  })
})

export const setRootResource = formStateReducer(({ state, editors, multiEditors }, { rootPointer }: { rootPointer: FocusNode }) => produce(state, (draft) => {
  if (rootPointer === draft.focusStack[0]) {
    return
  }

  draft.focusStack = [rootPointer]
  draft.resourceGraph = rootPointer.dataset
  draft.focusNodes = {
    [rootPointer.value]: initialiseFocusNode({
      focusNode: rootPointer,
      editors,
      multiEditors,
      shapes: state.shapes,
      shouldEnableEditorChoice: draft.shouldEnableEditorChoice,
    }, state.focusNodes[rootPointer.value]),
  }
}))
