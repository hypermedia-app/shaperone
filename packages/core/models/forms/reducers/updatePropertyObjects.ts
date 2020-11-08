import produce from 'immer'
import { Term } from 'rdf-js'
import { nanoid } from 'nanoid'
import { FocusNode } from '../../../index'
import { BaseParams, formStateReducer } from './index'
import { PropertyState } from '../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyState
  objects: Term[]
}

export const updatePropertyObjects = formStateReducer(({ state }, { focusNode, property, objects }: Params) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value]?.properties.find(({ shape }) => shape.equals(property.shape))

  if (propertyState) {
    propertyState.objects = objects.map(object => ({
      key: nanoid(),
      object,
      editors: [],
      selectedEditor: undefined,
      editorSwitchDisabled: state.shouldEnableEditorChoice({ object }),
    }))
  }
}))
