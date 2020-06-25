import { FormState, State } from '../index'
import { ValueEditor } from '../../editors/index'

export interface BaseParams {
  form: any
}

export interface SharedParams {
  state: FormState
  editors: ValueEditor[]
}

export function formStateReducer<T>(reduceForm: (sharedParams: SharedParams, payload: T) => FormState) {
  return (state: State, params: T & BaseParams): State => {
    const formState = state.instances.get(params.form)
    if (formState) {
      state.instances.set(params.form, reduceForm({
        state: formState,
        editors: state.valueEditors,
      }, params))
    }

    return state
  }
}
