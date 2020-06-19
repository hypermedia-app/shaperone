import { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import type { config } from '../state/config'
import type { createComponentsModel } from '../components'
import type { editors } from '../editors'

type Config = {
  models: (typeof config)['models'] & {
    components: ReturnType<typeof createComponentsModel>
    editors: typeof editors
  }
}

export type State = StoreState<Config>
export type Dispatch = StoreDispatch<Config>
export type Store = ModelStore<Dispatch, State>
