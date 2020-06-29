import type { FormState, State } from '../index'
import type { SingleEditor } from '../../editors/index'

export interface BaseParams {
  form: any
}

export interface SharedParams {
  state: FormState
  editors: SingleEditor[]
}

export function formStateReducer<T>(reduceForm: (sharedParams: SharedParams, payload: T) => FormState) {
  return (state: State, params: T & BaseParams): State => {
    const formState = state.instances.get(params.form)
    if (formState) {
      state.instances.set(params.form, reduceForm({
        state: formState,
        editors: state.singleEditors,
      }, params))
    }

    return state
  }
}
