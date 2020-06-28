import type { SingleEditor } from '../../editors/index'
import type { FormState, State } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  singleEditors: SingleEditor[]
}

export const setEditors = (state: State, { singleEditors }: Params): State => {
  const forms = [...state.instances.entries()].map<[unknown, FormState]>(([form, formState]) => {
    const focusNodes = Object.entries(formState.focusNodes)
      .reduce((focusNodes, [id, focusNodeState]) => ({
        ...focusNodes,
        [id]: initialiseFocusNode({
          ...focusNodeState,
          editors: singleEditors,
        }),
      }), {})

    return [form, {
      ...formState,
      focusNodes,
    }]
  })

  return {
    ...state,
    singleEditors,
    instances: new Map(forms),
  }
}
