import { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { forms } from '../models/forms'
import { editors } from '../models/editors'
import { createComponentsModel } from '../models/components'

interface Config {
  models: {
    forms: typeof forms
    editors: typeof editors
    components: ReturnType<typeof createComponentsModel>
  }
}

export type State = StoreState<Config>
export type Dispatch = StoreDispatch<Config>
export type Store = ModelStore<Dispatch, State>
