import produce from 'immer'
import type { PropertyObjectState } from '../index'
import { formStateReducer } from './index'

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
