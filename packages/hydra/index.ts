import type { StoreDispatch } from '@captaincodeman/rdx'
import type { editors } from '@hydrofoil/shaperone-core/models/editors'
import type { components } from '@hydrofoil/shaperone-core/models/components'
import type { HydraEnvironment } from 'alcaeus-core'
import { autocomplete, instancesSelector, multiInstanceSelector } from './components.js'

declare module '@hydrofoil/shaperone-core/env.js' {
  interface Requirements {
    hydra: HydraEnvironment
  }
}

interface Config {
  models: {
    editors: typeof editors
    components: typeof components
  }
}

type Dispatch = StoreDispatch<Config>

interface Configuration {
  editors: Dispatch['editors']
  components: Dispatch['components']
}

export default function setup(configuration: Configuration): void {
  configuration.components.decorate(instancesSelector.decorator)
  configuration.components.decorate(autocomplete.decorator)
  configuration.components.decorate(multiInstanceSelector.decorator)
  configuration.editors.decorate(instancesSelector.matcher)
  configuration.editors.decorate(autocomplete.matcher)
}
