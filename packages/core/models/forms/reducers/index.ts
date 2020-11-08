import type { FormState, State } from '../index'

export interface BaseParams {
  form: symbol
}

export interface SharedParams {
  state: FormState
}

export function formStateReducer<T>(reduceForm: (sharedParams: SharedParams, payload: T) => FormState) {
  return (state: State, params: T & BaseParams): State => {
    const formState = state.instances.get(params.form)
    if (formState) {
      state.instances.set(params.form, reduceForm({
        state: formState,
      }, params))
    }

    return state
  }
}
