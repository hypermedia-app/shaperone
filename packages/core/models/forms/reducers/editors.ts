import produce from 'immer'
import type { MultiEditor, SingleEditor } from '../../editors/index'
import type { FormState, State } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'
import { formStateReducer } from './index'

export interface SetEditorsParams {
  singleEditors: SingleEditor[]
  multiEditors: MultiEditor[]
}

export const setEditors = (state: State, { singleEditors, multiEditors }: SetEditorsParams): State => {
  const forms = [...state.instances.entries()].map<[unknown, FormState]>(([form, formState]) => {
    const focusNodes = Object.entries(formState.focusNodes)
      .reduce((focusNodes, [id, focusNodeState]) => ({
        ...focusNodes,
        [id]: initialiseFocusNode({
          ...focusNodeState,
          editors: singleEditors,
          multiEditors,
          shouldEnableEditorChoice: formState.shouldEnableEditorChoice,
        }, undefined),
      }), {})

    return [form, {
      ...formState,
      focusNodes,
    }]
  })

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
      for (const object of property.objects) {
        object.editorSwitchDisabled = !switchingEnabled
      }
    }
  }
}))
