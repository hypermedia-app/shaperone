import type { MultiEditor, SingleEditor } from '../../editors/index'
import type { FormState, State } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  singleEditors: SingleEditor[]
  multiEditors: MultiEditor[]
}

export const setEditors = (state: State, { singleEditors, multiEditors }: Params): State => {
  const forms = [...state.instances.entries()].map<[unknown, FormState]>(([form, formState]) => {
    const focusNodes = Object.entries(formState.focusNodes)
      .reduce((focusNodes, [id, focusNodeState]) => ({
        ...focusNodes,
        [id]: initialiseFocusNode({
          ...focusNodeState,
          editors: singleEditors,
          multiEditors,
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
