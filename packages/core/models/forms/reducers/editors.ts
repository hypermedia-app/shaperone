import type { ValueEditor } from '../../editors/index'
import type { FormState, State } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  valueEditors: ValueEditor[]
}

export const setEditors = (state: State, { valueEditors }: Params): State => {
  const forms = [...state.instances.entries()].map<[unknown, FormState]>(([form, formState]) => {
    const focusNodes = Object.entries(formState.focusNodes)
      .reduce((focusNodes, [id, focusNodeState]) => ({
        ...focusNodes,
        [id]: initialiseFocusNode({
          ...focusNodeState,
          editors: valueEditors,
        }),
      }), {})

    return [form, {
      ...formState,
      focusNodes,
    }]
  })

  return {
    ...state,
    valueEditors,
    instances: new Map(forms),
  }
}
