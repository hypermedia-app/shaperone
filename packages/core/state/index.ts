import { ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { forms } from '../models/forms'
import { editors } from '../models/editors'
import { components } from '../models/components'
import { resources } from '../models/resources'
import { shapes } from '../models/shapes'

interface Config {
  models: {
    forms: typeof forms
    editors: typeof editors
    resources: typeof resources
    shapes: typeof shapes
    components: typeof components
  }
}

export type State = StoreState<Config>
export type Dispatch = StoreDispatch<Config>
export type Store = ModelStore<Dispatch, State>
