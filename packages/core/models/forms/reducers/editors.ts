import produce from 'immer'
import type { PropertyObjectState, FormState } from '../index'
import { BaseParams, formStateReducer } from '../..'

type Params = BaseParams & { switchingEnabled: boolean }

export const toggleSwitching = formStateReducer((state: FormState, { switchingEnabled }: Params) => produce(state, (draft) => {
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
