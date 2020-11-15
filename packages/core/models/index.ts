export interface BaseParams {
  form: symbol
}

export function formStateReducer<TState, TMap extends Map<symbol, TState>, T extends BaseParams>(newState: (state: TState, params: T) => TState) {
  return (state: TMap, params: T): TMap => {
    const formState = state.get(params.form)
    if (formState) {
      state.set(params.form, newState(formState, params))
    }

    return state
  }
}
