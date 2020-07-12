import type { PropertyShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface MultiEditorParams {
  focusNode: FocusNode
  property: PropertyShape
}

export const selectMultiEditor = formStateReducer(({ state }, { focusNode, property }: MultiEditorParams) => ({
  ...state,
  focusNodes: {
    ...state.focusNodes,
    [focusNode.value]: {
      ...state.focusNodes[focusNode.value],
      properties: state.focusNodes[focusNode.value].properties.map((prop) => {
        if (prop.shape.equals(property)) {
          return {
            ...prop,
            selectedEditor: prop.editors[0]?.term,
          }
        }

        return prop
      }),
    },
  },
}))

export const selectSingleEditors = formStateReducer(({ state }, { focusNode, property }: MultiEditorParams) => ({
  ...state,
  focusNodes: {
    ...state.focusNodes,
    [focusNode.value]: {
      ...state.focusNodes[focusNode.value],
      properties: state.focusNodes[focusNode.value].properties.map((prop) => {
        if (prop.shape.equals(property)) {
          return {
            ...prop,
            selectedEditor: undefined,
          }
        }

        return prop
      }),
    },
  },
}))
