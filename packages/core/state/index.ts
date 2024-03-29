import { StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { ModelStore } from '@captaincodeman/rdx/typings/model.js'
import { forms } from '../models/forms/index.js'
import { editors } from '../models/editors/index.js'
import { components } from '../models/components/index.js'
import { resources } from '../models/resources/index.js'
import { shapes } from '../models/shapes/index.js'
import { validation } from '../models/validation/index.js'

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
