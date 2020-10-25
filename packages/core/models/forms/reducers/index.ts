import type { FormState, State } from '../index'
import type { MultiEditor, SingleEditor, Editor } from '../../editors'

export interface BaseParams {
  form: symbol
}

export interface SharedParams {
  state: FormState
  editors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
}

export function formStateReducer<T>(reduceForm: (sharedParams: SharedParams, payload: T) => FormState) {
  return (state: State, params: T & BaseParams): State => {
    const formState = state.instances.get(params.form)
    if (formState) {
      state.instances.set(params.form, reduceForm({
        state: formState,
        editors: state.singleEditors,
        multiEditors: state.multiEditors,
      }, params))
    }

    return state
  }
}
