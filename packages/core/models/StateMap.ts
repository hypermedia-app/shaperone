import { ShaperoneEnvironment } from '../env.js'

export interface StateMap<T> extends Map<symbol, T> {
  env: ShaperoneEnvironment
}

export default class <TState> extends Map<symbol, TState> {
  private _env!: ShaperoneEnvironment

  constructor(entries?: readonly (readonly [symbol, TState])[] | null, env?: ShaperoneEnvironment) {
    super(entries)
    if (env) {
      this._env = env
    }
  }

  get env() {
    return this._env
  }

  set env(env: ShaperoneEnvironment) {
    this._env = env
  }
}
