import type { StoreDispatch, StoreState } from '@captaincodeman/rdx'
import type { ModelStore } from '@captaincodeman/rdx/typings/model.js'
import type { forms } from '../models/forms/index.js'
import type { editors } from '../models/editors/index.js'
import type { components } from '../models/components/index.js'
import type { resources } from '../models/resources/index.js'
import type { shapes } from '../models/shapes/index.js'
import type { validation } from '../models/validation/index.js'

interface Config {
  models: {
    forms: typeof forms
    editors: typeof editors
    resources: typeof resources
    shapes: typeof shapes
    components: typeof components
    validation: typeof validation
  }
}

export type State = StoreState<Config>
export type Dispatch = StoreDispatch<Config>
export type Store = ModelStore<Dispatch, State>
