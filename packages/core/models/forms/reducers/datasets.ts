import { formStateReducer } from './index'
import { DatasetCore } from 'rdf-js'
import cf from 'clownface'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { Shape, ShapeMixin } from '@rdfine/shacl'
import { FocusNode } from '../../../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { FocusNodeState, FormState } from '../index'
import { matchFor } from '../lib/shapes'

export const setShapesGraph = formStateReducer(({ state, editors }, { shapesGraph }: { shapesGraph: DatasetCore }) => {
  if (state.shapesGraph === shapesGraph) {
    return state
  }

  const shapes = cf({ dataset: shapesGraph })
    .has(rdf.type, [sh.Shape, sh.NodeShape])
    .map(pointer => RdfResource.factory.createEntity<Shape>(pointer, [ShapeMixin]))

  const focusNodes = [...Object.values(state.focusNodes)].reduce<Record<string, FocusNodeState>>((focusNodes, focusNodeState) => {
    const { focusNode } = focusNodeState
    const shape = shapes.find(s => s.id.equals(focusNodeState.shape?.id)) ||
      shapes.filter(matchFor(focusNode))[0]

    return {
      ...focusNodes,
      [focusNode.value]: initialiseFocusNode({
        focusNode,
        shape,
        editors,
      }),
    }
  }, {})

  const missingNodes = state.focusStack.reduce<Record<string, FocusNodeState>>((missingNodes, focusNode) => {
    if (focusNodes[focusNode.value]) return missingNodes

    return {
      ...missingNodes,
      [focusNode.value]: initialiseFocusNode({
        focusNode,
        shape: shapes.filter(matchFor(focusNode))[0],
        editors,
      }),
    }
  }, {})

  return {
    ...state,
    shapesGraph,
    shapes,
    focusNodes: { ...focusNodes, ...missingNodes },
  }
})

export const setRootResource = formStateReducer(({ state, editors }, { rootPointer }: { rootPointer: FocusNode }) => {
  if (state.focusStack[0] !== rootPointer) {
    const focusNodes = <FormState['focusNodes']>{}
    if (state.shapes.length) {
      focusNodes[rootPointer.value] = initialiseFocusNode({
        focusNode: rootPointer,
        editors,
        shape: state.shapes.filter(matchFor(rootPointer))[0],
      })
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
