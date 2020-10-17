import { DatasetCore } from 'rdf-js'
import cf, { AnyPointer } from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { Shape, ShapeMixin } from '@rdfine/shacl'
import { formStateReducer } from './index'
import type { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import type { FocusNodeState, FormState } from '../index'

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

  return {
    ...state,
    shapesGraph: shapesPointer,
    shapes,
    focusNodes: { ...focusNodes, ...missingNodes },
  }
})

export const setRootResource = formStateReducer(({ state, editors, multiEditors }, { rootPointer }: { rootPointer: FocusNode }) => {
  if (state.focusStack[0] !== rootPointer) {
    const focusNodes = <FormState['focusNodes']>{}
    if (state.shapes.length) {
      focusNodes[rootPointer.value] = initialiseFocusNode({
        focusNode: rootPointer,
        editors,
        multiEditors,
        shapes: state.shapes,
        shouldEnableEditorChoice: state.shouldEnableEditorChoice,
      }, state.focusNodes[rootPointer.value])
    }

    return {
      ...state,
      focusStack: [rootPointer],
      resourceGraph: rootPointer.dataset,
      focusNodes,
    }
  }

  return state
})
