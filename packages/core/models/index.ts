import { ShaperoneEnvironment } from '../env.js'
import { StateMap } from './StateMap.js'

export interface BaseParams {
  form: symbol
}

export function formStateReducer<TState, TMap extends StateMap<TState>, T extends BaseParams>(newState: (state: TState, params: T, env: ShaperoneEnvironment) => TState, create?: () => TState) {
  return (state: TMap, params: T): TMap => {
    const formState = state.get(params.form) || create?.()
    if (formState) {
      state.set(params.form, newState(formState, params, state.env))
    }

    return state
  }
}
