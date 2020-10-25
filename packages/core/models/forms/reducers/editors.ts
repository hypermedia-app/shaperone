import produce from 'immer'
import type { MultiEditor, SingleEditor, Editor } from '../../editors'
import type { FormState, PropertyObjectState, State } from '../index'
import { initialisePropertyShapes } from '../lib/stateBuilder'
import { formStateReducer } from './index'

export interface SetEditorsParams {
  singleEditors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
}

export const setEditors = (state: State, { singleEditors, multiEditors }: SetEditorsParams): State => {
  const producer = produce((draft: [unknown, FormState]) => {
    const formState = draft[1]
    for (const [, focusNodeState] of Object.entries(formState.focusNodes)) {
      if (focusNodeState.shape) {
        const { groups, properties } = initialisePropertyShapes(focusNodeState.shape, {
          editors: singleEditors,
          multiEditors,
          shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
          focusNode: focusNodeState.focusNode,
        }, focusNodeState)

        focusNodeState.properties = properties
        focusNodeState.groups = groups
      }
    }
  })

  const forms = [...state.instances.entries()].map(producer)

  return {
    ...state,
    singleEditors,
    multiEditors,
    instances: new Map(forms),
  }
}

export const toggleSwitching = formStateReducer<{ switchingEnabled: boolean }>(({ state }, { switchingEnabled }) => produce(state, (draft) => {
  draft.shouldEnableEditorChoice = () => switchingEnabled

  for (const [, focusNode] of Object.entries(draft.focusNodes)) {
    for (const property of focusNode.properties) {
      for (const objectState of <PropertyObjectState[]>property.objects) {
        const { object } = objectState
        objectState.editorSwitchDisabled = !draft.shouldEnableEditorChoice({ object })
      }
    }
  }
}))
