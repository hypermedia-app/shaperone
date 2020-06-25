import { ValueEditor } from '../../editors/index'
import { FormState, State } from '../index'
import { initialiseFocusNode } from '../lib/stateBuilder'

export interface Params {
  valueEditors: ValueEditor[]
}

export const setEditors = (state: State, { valueEditors }: Params): State => {
  const forms = [...state.instances.entries()].map<[unknown, FormState]>(([form, formState]) => {
    const focusNodes = Object.entries(formState.focusNodes)
      .reduce((focusNodes, [id, focusNodeState]) => {
        return {
          ...focusNodes,
          [id]: initialiseFocusNode({
            ...focusNodeState,
            editors: valueEditors,
          }),
        }
      }, {})

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
