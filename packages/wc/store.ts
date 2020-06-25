import { createStore, ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { editors } from '@hydrofoil/shaperone-core/models/editors'
import { createComponentsModel } from '@hydrofoil/shaperone-core/models/components'
import { forms } from '@hydrofoil/shaperone-core/models/forms'
import { renderer } from './renderer/model'
import { TemplateResult } from 'lit-html'

const config = {
  models: {
    editors,
    renderer,
    forms,
    components: createComponentsModel<TemplateResult>(),
  },
}

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

export const store = createStore(config)
